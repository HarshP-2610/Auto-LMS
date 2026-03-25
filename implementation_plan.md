# Course Management in Admin Panel

This plan outlines the steps to add a new "Courses" page to the Admin panel, allowing administrators to view all existing courses on the platform, access their details, and delete any courses if necessary.

## Proposed Changes

### Frontend Component

#### [NEW] src/dashboards/admin/ManageCourses.tsx
- Create the [ManageCourses](file:///d:/Harsh/Auto-LMS/app/src/dashboards/instructor/ManageCourses.tsx#38-362) component using the same layout as [ManageStudents.tsx](file:///d:/Harsh/Auto-LMS/app/src/dashboards/admin/ManageStudents.tsx) but displaying course data similar to the instructor's [ManageCourses.tsx](file:///d:/Harsh/Auto-LMS/app/src/dashboards/instructor/ManageCourses.tsx).
- The page will fetch data from `GET /api/admin/courses-all`.
- It will include a data table with course title, instructor, category, enrolled students, rating, status, and price.
- Instead of "Create Course", the action menu will include "Preview" (linking to `/courses/:id`) and "Delete".
- The delete action will call `DELETE /api/admin/courses/:id` with a confirmation dialog.

#### [MODIFY] src/components/layout/Sidebar.tsx
- Add a new [NavItem](file:///d:/Harsh/Auto-LMS/app/src/components/layout/Sidebar.tsx#29-34) to the `adminNavItems` array:
  - Label: 'Courses'
  - Href: '/admin/courses'
  - Icon: A relevant Lucide icon like `BookOpen` or `Library`.

#### [MODIFY] src/routes/AppRoutes.tsx
- Add the route for the new admin component: `<Route path="/admin/courses" element={<ManageCourses />} />` inside the Admin Dashboard Routes section, likely importing it from `import { ManageCourses as AdminManageCourses } from '@/dashboards/admin/ManageCourses';` or similar to avoid conflict with the instructor's [ManageCourses](file:///d:/Harsh/Auto-LMS/app/src/dashboards/instructor/ManageCourses.tsx#38-362) import if any. Or simply name it `AdminManageCourses.tsx` in the admin folder? Since it's in a different folder, we can name it [ManageCourses](file:///d:/Harsh/Auto-LMS/app/src/dashboards/instructor/ManageCourses.tsx#38-362) but alias the import in [AppRoutes](file:///d:/Harsh/Auto-LMS/app/src/routes/AppRoutes.tsx#53-115).

## Verification Plan

### Automated Tests
- The backend `GET /api/admin/courses-all` and `DELETE /api/admin/courses/:id` endpoints already exist.

### Manual Verification
1. Login to the platform as an Admin.
2. Verify that the "Courses" tab appears in the Admin sidebar navigation.
3. Click "Courses" to navigate to `/admin/courses` and verify that the page loads properly.
4. Verify that the table displays a list of all courses across authors.
5. Click the "More Options" menu on a course and select "Preview" to ensure it redirects correctly to the course detail view.
6. Click "Delete", confirm the dialog, and verify that the course is successfully removed from the platform and the list is updated.
