# Barta

Welcome to Barta! This platform allows users to create, share, and interact with posts on various topics. Below is an overview of the website's features, along with essential details for accessing the admin panel and live site.

![MyWebsite](https://i.ibb.co/hcmRW8M/Untitled-design.png)

## Live Site URL

[Visit MyWebsite](https://forum-b54c7.web.app/)

- **Username:** zioun@gmail.com
- **Password:** Ab123456#

## Features

1. **Responsive Design**: The website is fully responsive and adapts seamlessly to mobile, tablet, and desktop views. The dashboard is also optimized for different devices.
   
2. **Persistent Private Routes**: Users remain logged in on private routes even after reloading the page, ensuring a smooth and uninterrupted experience.

3. **Secure Credentials**: Environment variables are used to securely hide Firebase config keys and MongoDB credentials.

4. **Custom Notifications**: Sweet alerts, toasts, and notifications are used for all CRUD operations and authentication processes, replacing default browser alerts for a better user experience.

5. **Data Fetching with Tanstack Query**: Tanstack Query is implemented for all GET requests, providing efficient and reliable data fetching.

6. **Home Page Features**:
   - **Navbar**: Contains the logo, website name, Home, Membership, Notification icon, and a Join Us button (or profile picture if logged in).
   - **Search Bar**: Located in the banner section, the search functionality is backend-driven and based on post tags.
   - **Tags Section**: Displays all available tags for users to search posts.
   - **Announcements**: Shows all announcements if any are made, with a notification icon displaying the count.
   - **Posts Display**: Lists posts in newest to oldest order, with an option to sort by popularity based on vote counts. Pagination is implemented with 5 posts per page.

7. **Post Details Page**: Displays detailed information about a post, including the author's details, post content, and interactive elements like comments, upvotes, downvotes, and sharing options.

8. **Membership Page**: Allows users to become members by paying a fee. Members receive a Gold badge and can create more than 5 posts.

9. **User Dashboard**:
   - **My Profile**: Displays user's name, image, email, badges, and recent posts.
   - **Add Post**: Users can add new posts. Normal users can add up to 5 posts, while members have no such limit.
   - **My Posts**: Shows all posts created by the user, with options to view comments, delete posts, and more.

10. **Admin Dashboard**:
    - **Admin Profile**: Shows admin's details and a pie chart of site statistics.
    - **Manage Users**: Admin can view and manage users, including promoting users to admins.
    - **Reported Comments**: Admin can view and act on reported comments or activities.
    - **Make Announcement**: Admin can create announcements that appear on the home page.

## Notable Commits

### Client Side (20+ Commits)
1. Implemented responsive design across all devices.
2. Added persistent private routes functionality.
3. Secured credentials using environment variables.
4. Integrated Sweet alerts and toasts for notifications.
5. Implemented Tanstack Query for data fetching.
6. Created the Navbar with dynamic elements based on login status.
7. Developed the search bar functionality.
8. Built the tags section for easy post searching.
9. Set up announcements section with dynamic visibility.
10. Created posts display with sorting and pagination.
11. Developed the post details page with interactive features.
12. Implemented the membership page with payment integration.
13. Designed the user dashboard with profile, add post, and my posts sections.
14. Added badges functionality based on user activity.
15. Built the comment section with voting and sharing options.
18. Added server-side search functionality for user management.
19. Developed the admin dashboard with profile, user management, and announcement sections.
20. Created reported comments section for admin actions.

### Server Side 
1. Set up backend search functionality for posts.
2. Implemented API for fetching tags.
3. Created API endpoints for announcements.
6. Set up secure routes for membership and user management.
8. Developed API for user badges.
9. Created endpoints for adding and managing posts.
10. Built API for comment reporting and feedback.
11. Implemented admin actions for reported comments.
12. Set up environment variables for secure credential storage.

Thank you for exploring MyWebsite! We hope you enjoy using it as much as we enjoyed building it.
