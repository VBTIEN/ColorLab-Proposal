# 🚀 HOW TO RUN - AI Image Analyzer Workshop

## ⚡ Quick Start (1 phút)

```bash
# 1. Navigate to project
cd /mnt/d/project/ai-image-analyzer-workshop

# 2. Run workshop
./run-workshop.sh

# 3. Choose option 1 (Demo Mode)
# 4. Copy URL vào browser
# 5. Upload ảnh và test!
```

## 📋 Detailed Steps

### Option 1: Demo Mode (Recommended for first time)
```bash
cd /mnt/d/project/ai-image-analyzer-workshop
./run-workshop.sh
# Choose: 1 (Demo Mode)
```

### Option 2: Full AWS Mode (Requires AWS account)
```bash
cd /mnt/d/project/ai-image-analyzer-workshop
./run-workshop.sh  
# Choose: 2 (Full AWS Mode)
# Follow AWS setup instructions
```

### Option 3: Manual Steps
```bash
# Demo mode
cd scripts/
./demo-mode.sh
./open-web.sh

# Copy URL to browser:
# file:///mnt/d/project/ai-image-analyzer-workshop/web/index.html
```

## 🌐 Web Interface URL

**Copy this URL to your browser:**
```
file:///mnt/d/project/ai-image-analyzer-workshop/web/index.html
```

## 🧪 Testing

1. **Upload Image**: Drag & drop any image
2. **Analyze**: Click "Analyze Image" button  
3. **View Results**: See AI analysis results
4. **Chat**: Ask questions about the image

### Test Images Suggestions:
- Portrait photos (for face analysis)
- Landscape photos (for object detection)
- Images with text (for OCR testing)
- Product photos (for object recognition)

## 🎯 Expected Results

### Demo Mode:
- ✅ Web interface loads
- ✅ Image upload works
- ✅ Shows sample analysis results
- ✅ Chat responds with demo answers

### Full AWS Mode:
- ✅ Real Rekognition analysis
- ✅ Real Bedrock AI responses
- ✅ Actual image processing
- ✅ Live AWS integration

## 🔧 Troubleshooting

### Web interface won't load:
```bash
# Check file path
ls -la web/index.html

# Try different browser
# Use full file path
```

### Scripts won't run:
```bash
# Make executable
chmod +x *.sh
chmod +x scripts/*.sh
```

### AWS errors (Full mode):
```bash
# Check credentials
aws configure list

# Check permissions
aws sts get-caller-identity
```

## 📚 Documentation

- `README.md` - Complete documentation
- `TEST-GUIDE.md` - Testing scenarios  
- `docs/` - Setup guides
- `QUICKSTART.md` - Quick reference

## 🎉 Success Indicators

✅ Web interface opens in browser
✅ Can upload images
✅ Analysis results appear
✅ Chat functionality works
✅ No console errors

## 📞 Need Help?

1. Check `TEST-GUIDE.md`
2. Review `README.md`
3. Look in `docs/` folder
4. Try demo mode first
5. Check browser console for errors

---

**🎯 Goal**: Get the web interface running and test image analysis!

**⏱️ Time**: 2-5 minutes for demo mode

**🎓 Learning**: AWS AI services integration
