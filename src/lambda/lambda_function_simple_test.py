"""
Simple Lambda Function for Testing S3 Folder Fix
"""
import json
import boto3
import base64
import uuid
from datetime import datetime
import traceback

# Initialize AWS clients
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    """Simple Lambda handler for testing"""
    
    # CORS headers
    headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
    
    try:
        print(f"🚀 Event received: {json.dumps(event)}")
        
        # Handle CORS preflight
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'CORS preflight thành công'}, ensure_ascii=False)
            }
        
        # Parse request body
        if 'body' not in event:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Thiếu dữ liệu request body'}, ensure_ascii=False)
            }
        
        try:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        except json.JSONDecodeError as e:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': f'Dữ liệu JSON không hợp lệ: {str(e)}'}, ensure_ascii=False)
            }
        
        # Get parameters
        bucket = body.get('bucket', 'image-analyzer-workshop-1751722329')
        image_data = body.get('image_data')
        
        if not image_data:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Thiếu dữ liệu ảnh (image_data)'}, ensure_ascii=False)
            }
        
        # Test S3 folder creation
        result = test_s3_folder_creation(bucket, image_data)
        
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
                'error': str(e),
                'trang_thai': 'that_bai',
                'thoi_gian': datetime.now().isoformat()
            }, ensure_ascii=False)
        }

def test_s3_folder_creation(bucket, image_data):
    """Test S3 folder creation and upload"""
    
    try:
        print(f"🧪 Testing S3 folder creation for bucket: {bucket}")
        
        # 1. Create folder structure
        now = datetime.now()
        folder_structure = f"uploads/{now.strftime('%Y')}/{now.strftime('%m')}/{now.strftime('%d')}/{now.strftime('%H')}"
        unique_id = str(uuid.uuid4())
        key = f"{folder_structure}/{unique_id}.jpg"
        
        print(f"📁 Folder structure: {folder_structure}")
        print(f"🔑 Full key: {key}")
        
        # 2. Decode image data
        try:
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            print(f"📊 Image size: {len(image_bytes)} bytes")
            
            if len(image_bytes) < 50:
                raise ValueError("Image data too small")
                
        except Exception as e:
            raise ValueError(f"Cannot decode image: {str(e)}")
        
        # 3. Create folder markers (optional)
        folder_parts = folder_structure.split('/')
        current_path = ""
        
        for part in folder_parts:
            current_path += part + "/"
            
            try:
                # Check if folder marker exists
                s3_client.head_object(Bucket=bucket, Key=current_path)
                print(f"📁 Folder exists: {current_path}")
            except:
                # Create folder marker
                try:
                    s3_client.put_object(
                        Bucket=bucket,
                        Key=current_path,
                        Body=b'',
                        ContentType='application/x-directory',
                        Metadata={
                            'created_at': datetime.now().isoformat(),
                            'type': 'folder_marker'
                        }
                    )
                    print(f"✅ Created folder marker: {current_path}")
                except Exception as folder_error:
                    print(f"⚠️ Could not create folder marker {current_path}: {str(folder_error)}")
        
        # 4. Upload image
        try:
            upload_response = s3_client.put_object(
                Bucket=bucket,
                Key=key,
                Body=image_bytes,
                ContentType='image/jpeg',
                Metadata={
                    'uploaded_at': datetime.now().isoformat(),
                    'test_version': 'simple_s3_folder_test',
                    'size_bytes': str(len(image_bytes))
                }
            )
            
            print(f"✅ Upload successful: s3://{bucket}/{key}")
            
            # Verify upload
            try:
                head_response = s3_client.head_object(Bucket=bucket, Key=key)
                file_size = head_response.get('ContentLength', 0)
                print(f"✅ Verified on S3 - Size: {file_size} bytes")
                
                upload_status = {
                    'status': 'success',
                    'etag': upload_response.get('ETag', ''),
                    'size_bytes': file_size,
                    'verified': True
                }
            except Exception as verify_error:
                print(f"⚠️ Could not verify upload: {str(verify_error)}")
                upload_status = {
                    'status': 'uploaded_but_not_verified',
                    'etag': upload_response.get('ETag', ''),
                    'warning': str(verify_error)
                }
            
        except Exception as upload_error:
            raise ValueError(f"Upload failed: {str(upload_error)}")
        
        # 5. Return success result
        result = {
            'trang_thai': 'thanh_cong',
            'thong_tin_upload': {
                's3_location': f's3://{bucket}/{key}',
                'folder_structure': folder_structure,
                'file_key': key,
                'upload_time': datetime.now().isoformat(),
                'image_size_bytes': len(image_bytes),
                'upload_status': upload_status
            },
            'test_info': {
                'version': 'simple_s3_folder_test',
                'bucket': bucket,
                'folder_created': True,
                'image_uploaded': True
            }
        }
        
        print(f"🎉 Test completed successfully!")
        return result
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        raise
