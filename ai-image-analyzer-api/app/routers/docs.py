"""
API Documentation endpoints
"""
from fastapi import APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter()

@router.get("/docs", response_class=HTMLResponse)
async def get_docs():
    """
    Custom API documentation
    """
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI Image Analyzer API Documentation</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
            .get { background: #61affe; }
            .post { background: #49cc90; }
            code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <h1>🤖 AI Image Analyzer API Documentation</h1>
        <p>Professional AI-powered image analysis service</p>
        
        <h2>📋 Available Endpoints</h2>
        
        <div class="endpoint">
            <h3><span class="method get">GET</span> /</h3>
            <p>Root endpoint with API information</p>
            <p><strong>Response:</strong> API metadata and available endpoints</p>
        </div>
        
        <div class="endpoint">
            <h3><span class="method get">GET</span> /health</h3>
            <p>Basic health check</p>
            <p><strong>Response:</strong> Service health status</p>
        </div>
        
        <div class="endpoint">
            <h3><span class="method get">GET</span> /api/v1/health</h3>
            <p>Detailed health check with AWS services</p>
            <p><strong>Response:</strong> Detailed health status including AWS services</p>
        </div>
        
        <div class="endpoint">
            <h3><span class="method post">POST</span> /api/v1/analyze</h3>
            <p>Analyze image with AI</p>
            <p><strong>Request Body:</strong></p>
            <pre><code>{
  "bucket": "your-s3-bucket",
  "image_data": "base64-encoded-image",
  "analysis_type": "comprehensive"
}</code></pre>
            <p><strong>Response:</strong> Comprehensive image analysis results</p>
        </div>
        
        <div class="endpoint">
            <h3><span class="method post">POST</span> /api/v1/upload</h3>
            <p>Upload image file</p>
            <p><strong>Request:</strong> Multipart form data with image file</p>
            <p><strong>Response:</strong> File information and base64 encoded data</p>
        </div>
        
        <h2>🔧 Usage Examples</h2>
        
        <h3>Health Check</h3>
        <pre><code>curl https://your-api-endpoint/health</code></pre>
        
        <h3>Image Analysis</h3>
        <pre><code>curl -X POST https://your-api-endpoint/api/v1/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "bucket": "your-bucket",
    "image_data": "base64-image-data",
    "analysis_type": "comprehensive"
  }'</code></pre>
        
        <h2>📞 Support</h2>
        <p>For support and questions, please contact the development team.</p>
        
        <hr>
        <p><em>AI Image Analyzer API v1.0.0</em></p>
    </body>
    </html>
    """
    return html_content
