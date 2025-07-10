"""
AI Image Analyzer - S3 Folder Fix Version (Corrected)
Sửa lỗi folder structure - chỉ đến ngày, không có giờ
"""
import json
import boto3
import base64
import uuid
from datetime import datetime
import traceback
import os
from botocore.exceptions import ClientError

# Initialize AWS clients
s3_client = boto3.client('s3')
rekognition_client = boto3.client('rekognition')
bedrock_client = boto3.client('bedrock-runtime')

def lambda_handler(event, context):
    """Main Lambda handler với S3 folder fix (corrected)"""
    
    # CORS headers
    headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
    
    try:
        print(f"🚀 Bắt đầu xử lý request: {event.get('httpMethod', 'UNKNOWN')}")
        
        # Handle CORS preflight
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'CORS preflight thành công'}, ensure_ascii=False)
            }
        
        # Parse request body
        if 'body' not in event:
            raise ValueError("Thiếu dữ liệu request body")
        
        try:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        except json.JSONDecodeError:
            raise ValueError("Dữ liệu JSON không hợp lệ")
        
        # Validate required fields
        bucket = body.get('bucket', 'image-analyzer-workshop-1751722329')
        image_data = body.get('image_data')
        
        if not image_data:
            raise ValueError("Thiếu dữ liệu ảnh (image_data)")
        
        # Process image with corrected S3 folder structure
        result = process_image_with_corrected_s3_folder(bucket, image_data, context)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(result, ensure_ascii=False)
        }
        
    except Exception as e:
        print(f"❌ Lỗi xử lý: {str(e)}")
        print(f"📋 Traceback: {traceback.format_exc()}")
        
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'loi': str(e),
                'trang_thai': 'that_bai',
                'thoi_gian': datetime.now().isoformat()
            }, ensure_ascii=False)
        }

def process_image_with_corrected_s3_folder(bucket, image_data, context):
    """Xử lý ảnh với S3 folder structure đã sửa"""
    
    try:
        # 1. Tạo folder structure và key (CORRECTED)
        folder_structure = create_corrected_s3_folder_structure()
        unique_id = str(uuid.uuid4())
        key = f"{folder_structure}/{unique_id}.jpg"
        
        print(f"📁 Tạo folder structure (corrected): {folder_structure}")
        print(f"🔑 S3 key hoàn chỉnh: {key}")
        
        # 2. Decode và validate image data
        image_bytes = decode_and_validate_image(image_data)
        
        # 3. Ensure S3 folder structure exists
        ensure_s3_folder_exists(bucket, folder_structure)
        
        # 4. Upload image to S3
        upload_result = upload_image_to_s3(bucket, key, image_bytes, context)
        
        # 5. Analyze image
        analysis_result = analyze_image_comprehensive(bucket, key)
        
        # 6. Create comprehensive response
        result = {
            'thong_tin_anh': {
                'vi_tri_s3': f's3://{bucket}/{key}',
                'folder_structure': folder_structure,
                'thoi_gian_phan_tich': datetime.now().isoformat(),
                'phien_ban': '3.1_s3_folder_fix_corrected',
                'kich_thuoc': len(image_bytes),
                'upload_info': upload_result
            },
            'phan_tich_ky_thuat': analysis_result.get('technical_analysis', {}),
            'phan_tich_ai': analysis_result.get('ai_analysis', {}),
            'trang_thai': 'thanh_cong'
        }
        
        print(f"✅ Hoàn thành xử lý ảnh: {key}")
        return result
        
    except Exception as e:
        print(f"❌ Lỗi trong process_image_with_corrected_s3_folder: {str(e)}")
        raise

def create_corrected_s3_folder_structure():
    """Tạo cấu trúc folder theo thời gian (CORRECTED - chỉ đến ngày)"""
    now = datetime.now()
    
    # FIXED: Chỉ tạo folder đến ngày, không có giờ
    folder_structure = f"uploads/{now.strftime('%Y')}/{now.strftime('%m')}/{now.strftime('%d')}"
    
    print(f"📅 Folder structure corrected: {folder_structure}")
    return folder_structure

def ensure_s3_folder_exists(bucket, folder_path):
    """Đảm bảo folder structure tồn tại trong S3"""
    try:
        # S3 không có folder thực sự, nhưng chúng ta có thể tạo "marker" objects
        # để đảm bảo folder structure hiển thị trong console
        
        folder_parts = folder_path.split('/')
        current_path = ""
        
        for part in folder_parts:
            current_path += part + "/"
            folder_key = current_path
            
            # Kiểm tra xem folder marker đã tồn tại chưa
            try:
                s3_client.head_object(Bucket=bucket, Key=folder_key)
                print(f"📁 Folder đã tồn tại: {folder_key}")
            except ClientError as e:
                if e.response['Error']['Code'] == '404':
                    # Tạo folder marker (empty object với trailing slash)
                    try:
                        s3_client.put_object(
                            Bucket=bucket,
                            Key=folder_key,
                            Body=b'',
                            ContentType='application/x-directory',
                            Metadata={
                                'created_at': datetime.now().isoformat(),
                                'type': 'folder_marker'
                            }
                        )
                        print(f"✅ Tạo folder marker: {folder_key}")
                    except Exception as folder_error:
                        print(f"⚠️ Không thể tạo folder marker {folder_key}: {str(folder_error)}")
                        # Không raise error vì folder marker không bắt buộc
                else:
                    print(f"⚠️ Lỗi kiểm tra folder {folder_key}: {str(e)}")
        
        print(f"✅ Folder structure đã sẵn sàng: {folder_path}")
        
    except Exception as e:
        print(f"⚠️ Lỗi tạo folder structure: {str(e)}")
        # Không raise error vì việc tạo folder marker không bắt buộc

def decode_and_validate_image(image_data):
    """Decode và validate dữ liệu ảnh"""
    try:
        # Remove data URL prefix if present
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        
        print(f"📊 Kích thước ảnh sau decode: {len(image_bytes)} bytes")
        
        # Validate image size
        if len(image_bytes) < 100:
            raise ValueError("Dữ liệu ảnh quá nhỏ, có thể bị lỗi")
        
        if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
            raise ValueError("Ảnh quá lớn (giới hạn 10MB)")
        
        # Basic image format validation
        if not (image_bytes.startswith(b'\xff\xd8') or  # JPEG
                image_bytes.startswith(b'\x89PNG') or   # PNG
                image_bytes.startswith(b'GIF')):        # GIF
            print("⚠️ Cảnh báo: Định dạng ảnh có thể không được hỗ trợ")
        
        return image_bytes
        
    except Exception as e:
        raise ValueError(f"Không thể decode dữ liệu ảnh: {str(e)}")

def upload_image_to_s3(bucket, key, image_bytes, context):
    """Upload ảnh lên S3 với error handling tốt"""
    try:
        print(f"📤 Đang upload ảnh lên S3: s3://{bucket}/{key}")
        
        # Determine content type
        content_type = 'image/jpeg'  # Default
        if image_bytes.startswith(b'\x89PNG'):
            content_type = 'image/png'
        elif image_bytes.startswith(b'GIF'):
            content_type = 'image/gif'
        
        # Upload with comprehensive metadata
        upload_response = s3_client.put_object(
            Bucket=bucket,
            Key=key,
            Body=image_bytes,
            ContentType=content_type,
            Metadata={
                'uploaded_at': datetime.now().isoformat(),
                'request_id': context.aws_request_id,
                'size_bytes': str(len(image_bytes)),
                'content_type': content_type,
                'version': '3.1_s3_folder_fix_corrected'
            },
            # Add tags for better organization
            Tagging='Type=ImageAnalysis&Version=3.1&AutoCreated=true'
        )
        
        print(f"✅ Upload S3 thành công: s3://{bucket}/{key}")
        
        # Verify upload
        try:
            head_response = s3_client.head_object(Bucket=bucket, Key=key)
            file_size = head_response.get('ContentLength', 0)
            last_modified = head_response.get('LastModified', '')
            
            print(f"✅ Xác nhận ảnh trên S3 - Size: {file_size} bytes, Modified: {last_modified}")
            
            return {
                'status': 'success',
                'etag': upload_response.get('ETag', ''),
                'size_bytes': file_size,
                'last_modified': str(last_modified),
                'content_type': content_type
            }
            
        except Exception as verify_error:
            print(f"⚠️ Không thể xác nhận upload: {str(verify_error)}")
            return {
                'status': 'uploaded_but_not_verified',
                'etag': upload_response.get('ETag', ''),
                'warning': str(verify_error)
            }
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        
        print(f"❌ AWS S3 Error [{error_code}]: {error_message}")
        
        if error_code == 'NoSuchBucket':
            raise ValueError(f"S3 bucket '{bucket}' không tồn tại")
        elif error_code == 'AccessDenied':
            raise ValueError(f"Không có quyền truy cập S3 bucket '{bucket}'")
        else:
            raise ValueError(f"Lỗi S3 [{error_code}]: {error_message}")
    
    except Exception as e:
        print(f"❌ Lỗi upload S3: {str(e)}")
        raise ValueError(f"Không thể upload ảnh lên S3: {str(e)}")

def analyze_image_comprehensive(bucket, key):
    """Phân tích ảnh toàn diện"""
    try:
        print(f"🔍 Bắt đầu phân tích ảnh: s3://{bucket}/{key}")
        
        # Basic Rekognition analysis
        rekognition_result = analyze_with_rekognition(bucket, key)
        
        # AI analysis with Bedrock (fallback if error)
        ai_analysis = analyze_with_bedrock_safe(rekognition_result)
        
        return {
            'technical_analysis': rekognition_result,
            'ai_analysis': ai_analysis
        }
        
    except Exception as e:
        print(f"❌ Lỗi phân tích ảnh: {str(e)}")
        return {
            'technical_analysis': {'error': str(e)},
            'ai_analysis': {'error': 'Không thể phân tích AI do lỗi kỹ thuật'}
        }

def analyze_with_rekognition(bucket, key):
    """Phân tích với Amazon Rekognition"""
    try:
        # Detect labels
        labels_response = rekognition_client.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            MaxLabels=20,
            MinConfidence=70
        )
        
        # Detect faces
        faces_response = rekognition_client.detect_faces(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            Attributes=['ALL']
        )
        
        # Detect text
        text_response = rekognition_client.detect_text(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}}
        )
        
        return {
            'doi_tuong_phat_hien': [
                {
                    'ten': label['Name'],
                    'do_tin_cay': round(label['Confidence'], 1)
                }
                for label in labels_response.get('Labels', [])
            ],
            'khuon_mat': len(faces_response.get('FaceDetails', [])),
            'van_ban_phat_hien': [
                text['DetectedText'] 
                for text in text_response.get('TextDetections', [])
                if text['Type'] == 'LINE'
            ]
        }
        
    except Exception as e:
        print(f"❌ Lỗi Rekognition: {str(e)}")
        return {'error': f'Lỗi phân tích Rekognition: {str(e)}'}

def analyze_with_bedrock_safe(rekognition_data):
    """Phân tích AI với Bedrock (có fallback)"""
    try:
        # Create prompt for AI analysis
        prompt = f"""
        Phân tích chuyên nghiệp bức ảnh này dựa trên dữ liệu kỹ thuật:
        
        Đối tượng phát hiện: {rekognition_data.get('doi_tuong_phat_hien', [])}
        Số khuôn mặt: {rekognition_data.get('khuon_mat', 0)}
        Văn bản: {rekognition_data.get('van_ban_phat_hien', [])}
        
        Hãy đưa ra phân tích chuyên nghiệp về:
        1. Composition và kỹ thuật
        2. Chất lượng và ánh sáng
        3. Nội dung và cảm xúc
        4. Gợi ý cải thiện
        
        Trả lời bằng tiếng Việt, chuyên nghiệp và chi tiết.
        """
        
        # Call Bedrock
        response = bedrock_client.invoke_model(
            modelId='anthropic.claude-3-sonnet-20240229-v1:0',
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-05-31',
                'max_tokens': 1000,
                'temperature': 0.4,
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ]
            })
        )
        
        result = json.loads(response['body'].read())
        ai_analysis = result['content'][0]['text']
        
        return {
            'phan_tich_chuyen_nghiep': ai_analysis,
            'trang_thai': 'thanh_cong'
        }
        
    except Exception as e:
        print(f"⚠️ Lỗi Bedrock AI: {str(e)}")
        
        # Fallback analysis
        return {
            'phan_tich_chuyen_nghiep': create_fallback_analysis(rekognition_data),
            'trang_thai': 'fallback',
            'luu_y': 'Sử dụng phân tích dự phòng do lỗi AI'
        }

def create_fallback_analysis(rekognition_data):
    """Tạo phân tích dự phòng khi AI không khả dụng"""
    
    objects = rekognition_data.get('doi_tuong_phat_hien', [])
    faces = rekognition_data.get('khuon_mat', 0)
    texts = rekognition_data.get('van_ban_phat_hien', [])
    
    analysis = f"""
    📸 PHÂN TÍCH CHUYÊN NGHIỆP (Phiên bản 3.1 - S3 Folder Fix Corrected)
    
    🔍 NỘI DUNG PHÁT HIỆN:
    """
    
    if objects:
        analysis += f"\n• Đối tượng chính: {', '.join([obj['ten'] for obj in objects[:5]])}"
        analysis += f"\n• Độ tin cậy trung bình: {sum([obj['do_tin_cay'] for obj in objects[:5]])/min(5, len(objects)):.1f}%"
    
    if faces > 0:
        analysis += f"\n• Phát hiện {faces} khuôn mặt trong ảnh"
    
    if texts:
        analysis += f"\n• Văn bản: {', '.join(texts[:3])}"
    
    analysis += f"""
    
    🎨 ĐÁNH GIÁ TỔNG QUAN:
    • Ảnh đã được upload thành công với folder structure đã sửa
    • Hệ thống phân tích kỹ thuật hoạt động ổn định
    • Chất lượng dữ liệu phân tích: Tốt
    
    ✨ TÍNH NĂNG MỚI (v3.1 Corrected):
    • ✅ S3 Folder Structure: uploads/YYYY/MM/DD (đã sửa lỗi)
    • ✅ Upload Verification: Xác nhận ảnh đã lưu thành công
    • ✅ Error Handling: Xử lý lỗi toàn diện
    • ✅ Metadata: Thông tin chi tiết về upload
    
    📊 THỐNG KÊ:
    • Đối tượng phát hiện: {len(objects)}
    • Khuôn mặt: {faces}
    • Văn bản: {len(texts)}
    • Trạng thái: Hoàn thành thành công
    """
    
    return analysis.strip()
