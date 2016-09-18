// Projects

// "/projects"
// Create new group: POST-[tag, name, desc, lat, lon, color, settingsProperties e.g. emails]

// "/projects/all"
//        POST - [limit, offset, lat, lon] -> List<Projects-[name, title, desc, numWorkers, lat, lon, color, settingsProperties, RandomUserInfo-[name, status, userPoints] - 10 Users]>

// action functions
// /projects/add_user- Add user into project and project to the user
//        POST- [user_id, project_id] -> 'success'

// /projects/remove_user- Removes User from Project and adds Project into User's Excluded_Projects list with excluded_reason
//        POST- [user_id, project_id] -> 'success'

// /projects/get_users - Returns Random users from Project (number of users should be limit)
//        POST = [project_id, limit] -> List<Users>

// /projects/get_list_updates - Returns list of updates from in the wall
//        POST - [projectID, limit, offset] -> List<Updates>

// /projects/update_setting_fields - Updates the current properties of a given group
//        POST - [projectID, settingsProperties (dictionary of properties)] -> Success


// /projects/fetch_reports
//        &GET - [projectID, limit, offset] -> List<Reports>

// /projects/add_reports
//        POST - [projectID, type: [Feedback, Complaints], Body: String, Metadata: Pictures, refInformation: Dictionary] -> Success

// /porjects/remove_report
//        POST - [projectID, reportID] -> Success

// Users
// "/user" - Create new users 
//        POST - [fname, lname, email, password, userSettingProperties]

// ACCESSOR functions
// userMetaData includes [fname, lname, settingsProperties, userID]
// ProjectMetaData includes []

// /user/get_self_updates - For the list of Updates that User wrote.
//        POST - [userID, limit, offset] -> List<Update>

// /user/get_starred_updates - For the list of Updates that User is interested in.
//        POST - [userID, limit, offset] -> List<Updates>

// /user/get_coworkers - Returns a list of the User's coworkers with UserMetadata defined above.
//        POST - [userID] -> List<UserMetadata>

// /user/get_excluded_coworkers - Returns a excluded_coworkers field from User object
// 		  POST - [userID] -> List<UserID> 

// /user/get_projects - Returns a list of the Projects that user currently added 
// 		  POST - [userID] -> List<project_id, status_level>

// /user/get_excluded_projects - Returns a list of the Projects 
//        POST - [userID] -> List<project_id, excluded_reason>


// /user/

// ACTION functions

// "/user/add_coworker"
//        POST - [this_user_id, coworker_id, project_id, project_name] -> Success

// /user/exclude_project - Removes the User from the list of Users in the Group and sets the Group into the User's Excluded_Projects list
//        POST - [this_user_id, project_id, exclude_reason] -> "Success"

// TODO: change to block_user to exlude_user
// /user/block_user -  Adds to the excluded users
//        Post - [this_user_id, blocked_user_id] -> Success

// Message

// /message/send - Sends a message between two users
//        POST - [this_user_id, coworker_id, message (String or picture)] -> Success

// /message/update_settings_field - Updates settings field of the Message.
//        POST - [messageID, settingsInfo] -> Success

// Update 
// /update - An user sends a message to a project. User must be in the group.
//        POST - [updateBody, projectID, userID, <Optional> pin_until] -> Success
//					pin_until only takes effect if it is submitted from admin of the Group - NEW IMPLEMENT following feature

// ACTION functions
// TODO: change name to upvote_update
// /update/update_priority - Should increment or decrement the points associated with the updateID and also update the User's points.
// 							And put this user ID to updateID's priority People (implicitely assume that you have the user ID)
//        GET - [updateID, updatePriority (number, + or - 1)] -> Success
// 				userID 

// Thread

// /Thread
//        POST - [this_user_id, coworker_id, limit, offset] -> List<Messages>

// Authentication // All already implemented
// /auth/login
//        GET - [email, password] -> Success

// /auth/logOut
//        GET - [email, password] -> Success

// /auth/authenticateEmail
//        GET - [email] -> Success

// Admin
// /admin - current_user_id is the User who the Admin is speaking to and who the Admin wants to make into another Admin.
//        &POST - [current_user_id, adminUserID, projectID] -> Success

// /admin/set_user_state - Admin can promote the User that he or she is speaking to.
//        &POST - [current_user_id, adminUserID, projectID, status] -> Success

// Location based query (this function is called /user/all on node server)
// "/user/list_projects" - find all projects within certain radius of user location, and created the after timeStamp
//        GET - [lon, lat, <Optional> radius, timeStamp] -> List<Projects-[lat, lon, timeStamp, projectID, numWorkers]>




// Deprecated method 
// /update/get_update_for_user
//        POST - [user_id, limit, offset] -> Updates
