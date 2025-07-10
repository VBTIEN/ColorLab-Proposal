"""
Security Utilities
Authentication, authorization và security functions
"""

import hashlib
import secrets
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from passlib.hash import bcrypt
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SecurityManager:
    """Security management utilities"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def generate_salt() -> str:
        """Generate a random salt"""
        return secrets.token_hex(32)
    
    @staticmethod
    def generate_api_key() -> str:
        """Generate a secure API key"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def generate_session_token() -> str:
        """Generate a session token"""
        return secrets.token_urlsafe(64)

class JWTManager:
    """JWT token management"""
    
    @staticmethod
    def create_access_token(
        data: Dict[str, Any], 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm=settings.ALGORITHM
        )
        
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=[settings.ALGORITHM]
            )
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            return None
        except jwt.JWTError as e:
            logger.warning(f"JWT error: {str(e)}")
            return None
    
    @staticmethod
    def create_refresh_token(user_id: str) -> str:
        """Create a refresh token"""
        data = {
            "user_id": user_id,
            "type": "refresh",
            "jti": secrets.token_hex(16)  # JWT ID for revocation
        }
        
        # Refresh tokens have longer expiry
        expires_delta = timedelta(days=30)
        return JWTManager.create_access_token(data, expires_delta)

class APIKeyManager:
    """API key management"""
    
    @staticmethod
    def generate_api_key_pair() -> Dict[str, str]:
        """Generate API key and secret pair"""
        api_key = f"ak_{secrets.token_urlsafe(16)}"
        api_secret = secrets.token_urlsafe(32)
        
        return {
            "api_key": api_key,
            "api_secret": api_secret,
            "api_key_hash": SecurityManager.hash_password(api_secret)
        }
    
    @staticmethod
    def verify_api_key(api_key: str, api_secret: str, stored_hash: str) -> bool:
        """Verify API key and secret"""
        return SecurityManager.verify_password(api_secret, stored_hash)

class RequestSigner:
    """Request signing utilities"""
    
    @staticmethod
    def sign_request(
        method: str,
        url: str,
        body: str,
        timestamp: str,
        api_secret: str
    ) -> str:
        """Sign a request using HMAC-SHA256"""
        import hmac
        
        # Create string to sign
        string_to_sign = f"{method}\n{url}\n{body}\n{timestamp}"
        
        # Create signature
        signature = hmac.new(
            api_secret.encode('utf-8'),
            string_to_sign.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return signature
    
    @staticmethod
    def verify_request_signature(
        method: str,
        url: str,
        body: str,
        timestamp: str,
        signature: str,
        api_secret: str,
        tolerance_seconds: int = 300
    ) -> bool:
        """Verify request signature"""
        try:
            # Check timestamp tolerance (prevent replay attacks)
            request_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            current_time = datetime.utcnow().replace(tzinfo=request_time.tzinfo)
            
            if abs((current_time - request_time).total_seconds()) > tolerance_seconds:
                logger.warning("Request timestamp outside tolerance")
                return False
            
            # Verify signature
            expected_signature = RequestSigner.sign_request(
                method, url, body, timestamp, api_secret
            )
            
            return hmac.compare_digest(signature, expected_signature)
            
        except Exception as e:
            logger.error(f"Signature verification error: {str(e)}")
            return False

class RateLimiter:
    """Rate limiting utilities"""
    
    def __init__(self):
        self.requests = {}  # In-memory storage, use Redis in production
    
    def is_allowed(
        self,
        identifier: str,
        limit: int = None,
        window: int = None
    ) -> bool:
        """Check if request is allowed based on rate limit"""
        limit = limit or settings.RATE_LIMIT_REQUESTS
        window = window or settings.RATE_LIMIT_WINDOW
        
        current_time = datetime.utcnow()
        window_start = current_time - timedelta(seconds=window)
        
        # Clean old requests
        if identifier in self.requests:
            self.requests[identifier] = [
                req_time for req_time in self.requests[identifier]
                if req_time > window_start
            ]
        else:
            self.requests[identifier] = []
        
        # Check if limit exceeded
        if len(self.requests[identifier]) >= limit:
            return False
        
        # Add current request
        self.requests[identifier].append(current_time)
        return True
    
    def get_remaining_requests(self, identifier: str) -> int:
        """Get remaining requests for identifier"""
        limit = settings.RATE_LIMIT_REQUESTS
        current_requests = len(self.requests.get(identifier, []))
        return max(0, limit - current_requests)

class InputValidator:
    """Input validation utilities"""
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename for safe storage"""
        import re
        
        # Remove path separators and dangerous characters
        filename = re.sub(r'[<>:"/\\|?*]', '', filename)
        
        # Limit length
        if len(filename) > 255:
            name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
            filename = name[:250] + ('.' + ext if ext else '')
        
        return filename
    
    @staticmethod
    def validate_image_format(content_type: str) -> bool:
        """Validate image content type"""
        allowed_types = [
            'image/jpeg', 'image/jpg', 'image/png', 
            'image/gif', 'image/webp', 'image/bmp'
        ]
        return content_type.lower() in allowed_types
    
    @staticmethod
    def validate_image_size(size_bytes: int) -> bool:
        """Validate image size"""
        max_size = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
        return size_bytes <= max_size

# Global instances
security_manager = SecurityManager()
jwt_manager = JWTManager()
api_key_manager = APIKeyManager()
request_signer = RequestSigner()
rate_limiter = RateLimiter()
input_validator = InputValidator()

# Dependency functions for FastAPI
def get_current_user(token: str) -> Optional[Dict[str, Any]]:
    """Get current user from JWT token"""
    return jwt_manager.verify_token(token)

def verify_api_key_dependency(api_key: str, api_secret: str) -> bool:
    """Dependency for API key verification"""
    # In a real application, you would look up the stored hash
    # For now, return True for development
    return True

def check_rate_limit(identifier: str) -> bool:
    """Check rate limit for identifier"""
    return rate_limiter.is_allowed(identifier)
