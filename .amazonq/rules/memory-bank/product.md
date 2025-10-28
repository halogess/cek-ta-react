# Product Overview

## Project Purpose
Cek-TA-React is a web-based document validation system designed for academic thesis (Tugas Akhir/TA) format checking. The application automates the validation of thesis documents against institutional formatting guidelines, helping students ensure their documents meet all requirements before submission.

## Value Proposition
- **Automated Validation**: Eliminates manual format checking by automatically validating thesis documents against predefined templates and rules
- **Real-time Feedback**: Provides immediate, detailed feedback on formatting errors with specific locations and correction steps
- **Dual-Role System**: Serves both students (mahasiswa) and administrators with role-specific interfaces and capabilities
- **Template Management**: Allows administrators to manage validation templates and formatting rules dynamically
- **Queue Management**: Handles multiple validation requests efficiently with queue positioning and status tracking

## Key Features

### For Students (Mahasiswa)
- **Document Upload**: Upload thesis documents (.docx) for automated validation
- **Validation Dashboard**: View validation status, queue position, and results
- **Detailed Error Reports**: Access comprehensive error lists with:
  - Error categories (Font, Spacing, Margins, etc.)
  - Severity levels (High, Medium, Low)
  - Exact locations (Chapter, Page, Paragraph)
  - Step-by-step correction instructions
  - Helpful tips for fixing issues
- **Document Structure View**: Visualize document structure with statistics per chapter/section
- **Validation History**: Track all past validation attempts with filtering and search
- **Certificate Download**: Download validation certificates for passed documents
- **Template Access**: View and download current formatting guidelines and templates

### For Administrators
- **Validation Management**: Monitor all validation requests across the system
- **Statistics Dashboard**: View system-wide metrics including:
  - Total validations processed
  - Queue status and waiting validations
  - Pass/fail rates
  - Common error statistics
- **Template Management**: 
  - Upload new validation templates
  - Edit template names and versions
  - Activate/deactivate templates
  - Configure formatting rules (page settings, fonts, components)
  - Enable/disable specific validation rules
- **Settings Control**: Configure minimum passing scores and system parameters
- **History & Filtering**: Advanced filtering by status, program, date range, and search
- **System Monitoring**: Track daily validations, average processing time, and success rates

## Target Users

### Primary Users - Students (Mahasiswa)
- Undergraduate and graduate students preparing thesis documents
- Students from Teknik Informatika, Sistem Informasi, and Teknologi Informasi programs
- Users need to validate documents against institutional formatting standards
- Require clear guidance on fixing formatting errors

### Secondary Users - Administrators
- Academic staff managing thesis validation processes
- Template and guideline maintainers
- System administrators monitoring validation performance
- Staff requiring oversight of validation statistics and trends

## Use Cases

### Student Workflow
1. Login with NRP (student ID) and password
2. Upload thesis document with title metadata
3. Monitor validation queue position and status
4. Review detailed error reports when validation completes
5. Download document structure analysis
6. Fix errors based on provided instructions
7. Re-upload corrected document for validation
8. Download validation certificate upon passing
9. Access template guidelines for reference

### Administrator Workflow
1. Login with admin credentials
2. Monitor dashboard for system statistics and trends
3. Review all validation requests and their statuses
4. Analyze common error patterns across submissions
5. Upload new template versions when guidelines change
6. Configure formatting rules and validation parameters
7. Adjust minimum passing scores as needed
8. Filter and search validation history for reporting
9. Track system performance metrics

## Technical Capabilities
- Mock API mode for development and testing
- Real API integration ready (configurable via environment variables)
- Responsive design for desktop and mobile devices
- Document preview functionality
- File size validation and format checking
- Persistent authentication with localStorage
- Real-time status updates
- Advanced filtering and search capabilities
