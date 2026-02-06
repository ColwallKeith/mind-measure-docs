# University S3 Bucket Protocol

## 🎯 **Overview**
This protocol ensures that every new university gets its own dedicated S3 bucket for secure, isolated file storage. This provides better data governance, security, and scalability.

## 🏗️ **Automated Bucket Creation Process**

### 1. **When a University is Created**
- **Trigger**: `createUniversity()` function in `src/features/cms/data.ts`
- **Action**: Automatically calls `/api/universities/create-bucket` endpoint
- **Bucket Name**: `mindmeasure-{university-slug}` (e.g., `mindmeasure-worcester`)
- **Region**: `eu-west-2` (London)

### 2. **Bucket Configuration**
Each university bucket is automatically configured with:
- ✅ **CORS**: Allows uploads from admin and mobile domains
- ✅ **Versioning**: Enabled for file history
- ✅ **Encryption**: AES256 server-side encryption
- ✅ **Public Access**: Blocked for security
- ✅ **Region**: `eu-west-2` (consistent with other AWS resources)

### 3. **Folder Structure**
Within each university bucket:
```
mindmeasure-{university-slug}/
├── logos/           # University logos (light/dark)
├── favicons/        # Website favicons
├── campus/          # Campus images
├── documents/       # Official documents
├── resources/       # Educational resources
└── temp/           # Temporary uploads
```

## 🔧 **Technical Implementation**

### API Endpoint: `/api/universities/create-bucket`
- **Method**: POST
- **Parameters**: 
  - `universitySlug`: URL-safe university identifier
  - `universityName`: Human-readable name (for logging)
- **Response**: Bucket creation status and details

### Frontend Integration
- **FileUpload Component**: Uses `bucket={mindmeasure-${universityId}}`
- **Dynamic Bucket Names**: Each university's uploads go to their dedicated bucket
- **Fallback**: Uses `mindmeasure-default` if university ID is missing

## 🛡️ **Security & Compliance**

### Data Isolation
- ✅ **University A** cannot access **University B's** files
- ✅ Each bucket has independent access controls
- ✅ Easier compliance with data protection regulations

### Access Control
- ✅ **Admin Panel**: Can upload/manage files for their university
- ✅ **Mobile App**: Can access university-specific resources
- ✅ **Cross-Origin**: Properly configured CORS policies

## 📋 **Protocol Checklist**

### For New University Creation:
- [ ] University record created in database
- [ ] University slug generated (URL-safe)
- [ ] S3 bucket created: `mindmeasure-{slug}`
- [ ] Bucket configured with security settings
- [ ] CORS policies applied
- [ ] Folder structure ready for uploads
- [ ] Success/failure logged appropriately

### For File Uploads:
- [ ] FileUpload component uses correct bucket name
- [ ] Files uploaded to university-specific bucket
- [ ] Proper folder organization maintained
- [ ] Signed URLs generated for secure access

## 🚨 **Error Handling**

### Bucket Creation Failures:
- **Bucket Already Exists**: Log warning, continue (bucket may be reused)
- **AWS Permissions**: Log error, continue (manual bucket creation needed)
- **Network Issues**: Log error, continue (retry mechanism available)

### Upload Failures:
- **Bucket Not Found**: Create bucket on-demand or fallback to default
- **Permission Denied**: Check AWS credentials and bucket policies
- **File Too Large**: Enforce size limits in FileUpload component

## 🔄 **Maintenance & Monitoring**

### Regular Checks:
- [ ] Monitor bucket creation success rates
- [ ] Verify bucket configurations remain correct
- [ ] Check for orphaned buckets (universities deleted)
- [ ] Review storage costs per university

### Cleanup Protocol:
- [ ] When university is deleted, archive bucket contents
- [ ] Move to cold storage after 90 days
- [ ] Delete after retention period (as per data policy)

## 🧪 **Testing Protocol**

### Before Deployment:
- [ ] Test bucket creation with new university
- [ ] Verify file uploads work correctly
- [ ] Check CORS policies with admin domain
- [ ] Confirm bucket security settings
- [ ] Test error handling scenarios

### After Deployment:
- [ ] Monitor bucket creation logs
- [ ] Verify existing universities can still upload
- [ ] Check AWS costs and usage patterns
- [ ] Test university-specific file access

## 📞 **Troubleshooting**

### Common Issues:
1. **"Bucket does not exist"**: Check if bucket creation failed during university setup
2. **"Access denied"**: Verify AWS credentials and bucket policies
3. **"CORS error"**: Check bucket CORS configuration
4. **"Region mismatch"**: Ensure all buckets created in `eu-west-2`

### Quick Fixes:
- **Manual bucket creation**: Use `scripts/create-s3-bucket.js`
- **Bucket reconfiguration**: Call `/api/universities/create-bucket` again
- **Fallback bucket**: Temporarily use `mindmeasure-default` bucket

## 🎯 **Benefits of This Protocol**

1. **🔒 Security**: Complete data isolation between universities
2. **📊 Compliance**: Easier to meet data protection requirements
3. **🚀 Scalability**: Each university can grow independently
4. **🔧 Maintenance**: Easier to manage and monitor per-university usage
5. **💰 Cost Tracking**: Clear visibility of storage costs per university
6. **🛡️ Risk Reduction**: Bucket compromise affects only one university

---

**⚠️ CRITICAL**: Always reference this protocol before making changes to university creation or file upload systems. This ensures consistent, secure, and scalable university data management.
