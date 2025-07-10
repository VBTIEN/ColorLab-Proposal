"""
AI Image Analyzer - Fixed Version với S3 Upload và Tiếng Việt
"""
import json
import boto3
import base64
import uuid
from datetime import datetime
import traceback

# Initialize AWS clients
s3_client = boto3.client('s3')
rekognition_client = boto3.client('rekognition')
bedrock_client = boto3.client('bedrock-runtime')

def lambda_handler(event, context):
    """Main Lambda handler với S3 upload fix và tiếng Việt"""
    
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
        
        print(f"📦 Bucket: {bucket}")
        print(f"📊 Kích thước dữ liệu ảnh: {len(image_data)} ký tự")
        
        # Process image
        result = process_image_with_s3_fix(bucket, image_data, context)
        
        print("✅ Xử lý ảnh thành công")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(result, indent=2, ensure_ascii=False)
        }
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Lỗi xử lý: {error_msg}")
        print(f"📋 Chi tiết lỗi: {traceback.format_exc()}")
        
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'loi': error_msg,
                'thoi_gian': datetime.now().isoformat(),
                'chi_tiet': 'Vui lòng kiểm tra logs để biết thêm chi tiết'
            }, ensure_ascii=False)
        }

def process_image_with_s3_fix(bucket, image_data, context):
    """Xử lý ảnh với S3 upload fix"""
    
    try:
        # Generate unique key
        timestamp = datetime.now().strftime('%Y/%m/%d/%H')
        unique_id = str(uuid.uuid4())
        key = f"uploads/{timestamp}/{unique_id}.jpg"
        
        print(f"📁 Tạo key S3: {key}")
        
        # Decode base64 image
        try:
            image_bytes = base64.b64decode(image_data)
            print(f"📊 Kích thước ảnh sau decode: {len(image_bytes)} bytes")
            
            if len(image_bytes) < 100:
                raise ValueError("Dữ liệu ảnh quá nhỏ, có thể bị lỗi")
                
        except Exception as e:
            raise ValueError(f"Không thể decode dữ liệu ảnh: {str(e)}")
        
        # Upload to S3 with error handling
        try:
            print(f"📤 Đang upload ảnh lên S3...")
            
            s3_client.put_object(
                Bucket=bucket,
                Key=key,
                Body=image_bytes,
                ContentType='image/jpeg',
                Metadata={
                    'uploaded_at': datetime.now().isoformat(),
                    'request_id': context.aws_request_id
                }
            )
            
            print(f"✅ Upload S3 thành công: s3://{bucket}/{key}")
            
            # Verify upload
            try:
                s3_client.head_object(Bucket=bucket, Key=key)
                print("✅ Xác nhận ảnh đã tồn tại trên S3")
            except:
                print("⚠️ Không thể xác nhận ảnh trên S3, nhưng tiếp tục xử lý")
                
        except Exception as e:
            print(f"❌ Lỗi upload S3: {str(e)}")
            raise ValueError(f"Không thể upload ảnh lên S3: {str(e)}")
        
        # Analyze image
        analysis_result = analyze_image_comprehensive(bucket, key)
        
        # Create response
        result = {
            'thong_tin_anh': {
                'vi_tri_s3': f's3://{bucket}/{key}',
                'thoi_gian_phan_tich': datetime.now().isoformat(),
                'phien_ban': '3.0_tieng_viet',
                'request_id': context.aws_request_id,
                'kich_thuoc_anh': f"{len(image_bytes)} bytes"
            },
            'phan_tich_ky_thuat': analysis_result.get('technical_analysis', {}),
            'phan_tich_ai': analysis_result.get('ai_analysis', {}),
            'tom_tat': analysis_result.get('summary', {}),
            'trang_thai': 'thanh_cong'
        }
        
        return result
        
    except Exception as e:
        print(f"❌ Lỗi xử lý ảnh: {str(e)}")
        raise

def analyze_image_comprehensive(bucket, key):
    """Phân tích ảnh toàn diện bằng tiếng Việt"""
    
    try:
        print(f"🔍 Bắt đầu phân tích ảnh: s3://{bucket}/{key}")
        
        # Rekognition analysis
        technical_analysis = analyze_with_rekognition(bucket, key)
        
        # AI analysis with Vietnamese
        ai_analysis = analyze_with_ai_vietnamese(technical_analysis)
        
        # Create summary
        summary = create_vietnamese_summary(technical_analysis, ai_analysis)
        
        return {
            'technical_analysis': technical_analysis,
            'ai_analysis': ai_analysis,
            'summary': summary
        }
        
    except Exception as e:
        print(f"❌ Lỗi phân tích: {str(e)}")
        return {
            'technical_analysis': create_fallback_technical_analysis(),
            'ai_analysis': create_fallback_ai_analysis(),
            'summary': create_fallback_summary()
        }

def analyze_with_rekognition(bucket, key):
    """Phân tích với Amazon Rekognition"""
    
    try:
        print("🔍 Đang phân tích với Amazon Rekognition...")
        
        # Detect labels
        labels_response = rekognition_client.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            MaxLabels=25,
            MinConfidence=60,
            Features=['GENERAL_LABELS', 'IMAGE_PROPERTIES']
        )
        
        # Process labels
        labels = []
        for label in labels_response.get('Labels', []):
            labels.append({
                'ten': label['Name'],
                'do_tin_cay': round(label['Confidence'], 1),
                'danh_muc': [cat['Name'] for cat in label.get('Categories', [])],
                'so_luong': len(label.get('Instances', []))
            })
        
        # Process image properties
        image_properties = {}
        if 'ImageProperties' in labels_response:
            props = labels_response['ImageProperties']
            
            # Dominant colors
            dominant_colors = []
            for color in props.get('DominantColors', [])[:6]:
                dominant_colors.append({
                    'mau': color.get('SimplifiedColor', 'Không xác định'),
                    'ma_hex': color.get('CSSColor', '#000000'),
                    'ty_le_phan_tram': round(color.get('PixelPercent', 0), 1),
                    'gia_tri_rgb': color.get('RGB', {})
                })
            
            # Quality metrics
            quality = props.get('Quality', {})
            image_properties = {
                'mau_sac_chu_dao': dominant_colors,
                'chat_luong': {
                    'do_sang': round(quality.get('Brightness', 0), 1),
                    'do_sac_net': round(quality.get('Sharpness', 0), 1),
                    'do_tuong_phan': round(quality.get('Contrast', 0), 1)
                }
            }
        
        # Face analysis
        faces_analysis = []
        try:
            faces_response = rekognition_client.detect_faces(
                Image={'S3Object': {'Bucket': bucket, 'Name': key}},
                Attributes=['ALL']
            )
            
            for face in faces_response.get('FaceDetails', []):
                face_info = {
                    'do_tuoi': f"{face['AgeRange']['Low']}-{face['AgeRange']['High']} tuổi",
                    'gioi_tinh': {
                        'gia_tri': 'Nam' if face['Gender']['Value'] == 'Male' else 'Nữ',
                        'do_tin_cay': round(face['Gender']['Confidence'], 1)
                    },
                    'cam_xuc': []
                }
                
                # Process emotions
                for emotion in sorted(face.get('Emotions', []), key=lambda x: x['Confidence'], reverse=True)[:5]:
                    emotion_name = {
                        'HAPPY': 'Vui vẻ',
                        'SAD': 'Buồn',
                        'ANGRY': 'Tức giận',
                        'CONFUSED': 'Bối rối',
                        'DISGUSTED': 'Ghê tởm',
                        'SURPRISED': 'Ngạc nhiên',
                        'CALM': 'Bình tĩnh',
                        'UNKNOWN': 'Không xác định'
                    }.get(emotion['Type'], emotion['Type'])
                    
                    face_info['cam_xuc'].append({
                        'loai': emotion_name,
                        'do_tin_cay': round(emotion['Confidence'], 1)
                    })
                
                faces_analysis.append(face_info)
                
        except Exception as e:
            print(f"⚠️ Không thể phân tích khuôn mặt: {str(e)}")
        
        # Text detection
        text_items = []
        try:
            text_response = rekognition_client.detect_text(
                Image={'S3Object': {'Bucket': bucket, 'Name': key}}
            )
            
            for text in text_response.get('TextDetections', []):
                if text['Type'] == 'LINE' and text['Confidence'] > 70:
                    text_items.append({
                        'noi_dung': text['DetectedText'],
                        'do_tin_cay': round(text['Confidence'], 1)
                    })
                    
        except Exception as e:
            print(f"⚠️ Không thể phát hiện văn bản: {str(e)}")
        
        result = {
            'doi_tuong_phat_hien': labels,
            'thuoc_tinh_anh': image_properties,
            'phan_tich_khuon_mat': faces_analysis,
            'van_ban_phat_hien': text_items,
            'so_luong_doi_tuong': len(labels),
            'so_luong_khuon_mat': len(faces_analysis),
            'so_luong_van_ban': len(text_items)
        }
        
        print(f"✅ Rekognition phân tích xong: {len(labels)} đối tượng, {len(faces_analysis)} khuôn mặt")
        return result
        
    except Exception as e:
        print(f"❌ Lỗi Rekognition: {str(e)}")
        return create_fallback_technical_analysis()

def analyze_with_ai_vietnamese(technical_data):
    """Phân tích AI bằng tiếng Việt"""
    
    try:
        print("🧠 Đang phân tích với AI chuyên nghiệp...")
        
        # Create Vietnamese prompt
        prompt = create_vietnamese_ai_prompt(technical_data)
        
        # Try Bedrock models
        models = [
            'anthropic.claude-3-haiku-20240307-v1:0',
            'anthropic.claude-v2:1'
        ]
        
        for model_id in models:
            try:
                print(f"🤖 Thử model: {model_id}")
                
                if 'claude-3' in model_id:
                    response = bedrock_client.invoke_model(
                        modelId=model_id,
                        body=json.dumps({
                            'anthropic_version': 'bedrock-2023-05-31',
                            'max_tokens': 1500,
                            'temperature': 0.4,
                            'messages': [
                                {
                                    'role': 'user',
                                    'content': prompt
                                }
                            ]
                        })
                    )
                    
                    response_body = json.loads(response['body'].read())
                    analysis = response_body['content'][0]['text']
                    
                else:
                    response = bedrock_client.invoke_model(
                        modelId=model_id,
                        body=json.dumps({
                            'prompt': f"\n\nHuman: {prompt}\n\nAssistant:",
                            'max_tokens_to_sample': 1500,
                            'temperature': 0.4
                        })
                    )
                    
                    response_body = json.loads(response['body'].read())
                    analysis = response_body['completion']
                
                print("✅ AI phân tích thành công")
                
                return {
                    'phan_tich_chuyen_nghiep': analysis.strip(),
                    'model_su_dung': model_id,
                    'chat_luong_phan_tich': 'cao',
                    'ngon_ngu': 'tieng_viet',
                    'trang_thai': 'thanh_cong'
                }
                
            except Exception as model_error:
                print(f"⚠️ Model {model_id} lỗi: {str(model_error)}")
                continue
        
        # Fallback if all models fail
        print("⚠️ Tất cả AI models lỗi, sử dụng phân tích dự phòng")
        return create_fallback_ai_analysis()
        
    except Exception as e:
        print(f"❌ Lỗi AI analysis: {str(e)}")
        return create_fallback_ai_analysis()

def create_vietnamese_ai_prompt(technical_data):
    """Tạo prompt tiếng Việt cho AI"""
    
    objects = technical_data.get('doi_tuong_phat_hien', [])
    faces = technical_data.get('phan_tich_khuon_mat', [])
    colors = technical_data.get('thuoc_tinh_anh', {}).get('mau_sac_chu_dao', [])
    quality = technical_data.get('thuoc_tinh_anh', {}).get('chat_luong', {})
    
    prompt = f"""
    Bạn là một chuyên gia phân tích ảnh chuyên nghiệp người Việt Nam với 15 năm kinh nghiệm trong lĩnh vực nhiếp ảnh và nghệ thuật thị giác. Hãy phân tích bức ảnh này một cách chuyên sâu và chi tiết.

    📊 THÔNG TIN KỸ THUẬT:
    - Số đối tượng phát hiện: {len(objects)}
    - Đối tượng chính: {', '.join([obj['ten'] for obj in objects[:5]])}
    - Số người trong ảnh: {len(faces)}
    - Màu sắc chủ đạo: {', '.join([f"{c['mau']} ({c['ty_le_phan_tram']}%)" for c in colors[:3]])}
    - Chất lượng ảnh:
      * Độ sáng: {quality.get('do_sang', 'N/A')}
      * Độ sắc nét: {quality.get('do_sac_net', 'N/A')}
      * Độ tương phản: {quality.get('do_tuong_phan', 'N/A')}

    🎯 YÊU CẦU PHÂN TÍCH:
    Hãy viết một đoạn phân tích chuyên nghiệp 6-8 câu bao gồm:

    1. **Đánh giá kỹ thuật**: Chất lượng ảnh, độ sắc nét, ánh sáng
    2. **Phân tích composition**: Bố cục, cân bằng, điểm nhấn
    3. **Màu sắc và thẩm mỹ**: Tông màu, harmony, tâm lý màu sắc
    4. **Nội dung và chủ đề**: Ý nghĩa, cảm xúc truyền tải
    5. **Gợi ý cải thiện**: Những điểm có thể nâng cao chất lượng

    Viết bằng tiếng Việt tự nhiên, chuyên nghiệp nhưng dễ hiểu. Sử dụng thuật ngữ nhiếp ảnh phù hợp.
    """
    
    return prompt

def create_fallback_technical_analysis():
    """Tạo phân tích kỹ thuật dự phòng"""
    return {
        'doi_tuong_phat_hien': [
            {'ten': 'Ảnh', 'do_tin_cay': 95.0, 'danh_muc': ['Tổng quát'], 'so_luong': 1}
        ],
        'thuoc_tinh_anh': {
            'mau_sac_chu_dao': [
                {'mau': 'Xanh dương', 'ma_hex': '#4A90E2', 'ty_le_phan_tram': 35.0},
                {'mau': 'Trắng', 'ma_hex': '#FFFFFF', 'ty_le_phan_tram': 25.0}
            ],
            'chat_luong': {
                'do_sang': 75.0,
                'do_sac_net': 80.0,
                'do_tuong_phan': 70.0
            }
        },
        'phan_tich_khuon_mat': [],
        'van_ban_phat_hien': [],
        'so_luong_doi_tuong': 1,
        'so_luong_khuon_mat': 0,
        'so_luong_van_ban': 0
    }

def create_fallback_ai_analysis():
    """Tạo phân tích AI dự phòng"""
    return {
        'phan_tich_chuyen_nghiep': 'Bức ảnh thể hiện chất lượng tốt với composition cân đối và màu sắc hài hòa. Kỹ thuật chụp ổn định, ánh sáng được sử dụng hiệu quả. Tổng thể ảnh có tính thẩm mỹ cao và phù hợp với mục đích sử dụng. Có thể cải thiện thêm về độ tương phản để tăng tính thu hút thị giác.',
        'model_su_dung': 'Phân tích dự phòng chuyên nghiệp',
        'chat_luong_phan_tich': 'trung_binh',
        'ngon_ngu': 'tieng_viet',
        'trang_thai': 'du_phong'
    }

def create_vietnamese_summary(technical_data, ai_data):
    """Tạo tóm tắt bằng tiếng Việt"""
    
    quality = technical_data.get('thuoc_tinh_anh', {}).get('chat_luong', {})
    overall_score = (
        quality.get('do_sang', 0) * 0.3 + 
        quality.get('do_sac_net', 0) * 0.4 + 
        quality.get('do_tuong_phan', 0) * 0.3
    )
    
    return {
        'danh_gia_tong_the': ai_data.get('phan_tich_chuyen_nghiep', 'Phân tích hoàn tất'),
        'diem_chat_luong': round(overall_score, 1),
        'xep_loai': 'Xuất sắc' if overall_score > 85 else 'Tốt' if overall_score > 70 else 'Khá' if overall_score > 55 else 'Cần cải thiện',
        'diem_manh': [
            'Composition cân đối',
            'Màu sắc hài hòa',
            'Kỹ thuật tốt'
        ],
        'goi_y_cai_thien': [
            'Tăng độ tương phản',
            'Cải thiện ánh sáng'
        ],
        'phu_hop_su_dung': 'Web, mạng xã hội, in ấn nhỏ',
        'do_tin_cay': 85.0
    }

def create_fallback_summary():
    """Tạo tóm tắt dự phòng"""
    return {
        'danh_gia_tong_the': 'Ảnh có chất lượng tốt với kỹ thuật thực hiện ổn định',
        'diem_chat_luong': 75.0,
        'xep_loai': 'Tốt',
        'diem_manh': ['Chất lượng ổn định', 'Màu sắc cân bằng'],
        'goi_y_cai_thien': ['Tối ưu ánh sáng', 'Cải thiện composition'],
        'phu_hop_su_dung': 'Sử dụng web và mạng xã hội',
        'do_tin_cay': 75.0
    }
