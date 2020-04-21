Unfinished showcase project

About project(at the moment, will be updated):

User can signup with email/password or choose to sign up with github or google

User must use unique email and username

With every signup/login he is given token(session) to be stored in local storage

At logout session is deleted, as is token from storage

if user is not loged out he's session will be saved and verified and he doesn'have to login 

Users password is hashed at sign in and compared at every login(email users and admin users)

User can upload new images to the website, pin(save) other images or see his own images

User can comment on every image and reply to any comment

User can delete his image, comment or reply

User can delete his account which will delete all his images and account will be deleted from database


Admin user (invite code: 123465789)

Can do same things as regular user

Has privilege to delete other users images, comments or replies

Logs in on /admin route


Anonimus

Anonimus users can see images and search for particular images

Can see image details, comments and replies 


Implemented and tested on server but not implemented on front end:

Changing password for email and admin users

Ability to edit image, comment or reply




Used technologies:

nodejs with express

mongodb for storing data

AWS s3 for storing images

front end Reactjs(hooks)



Plans for future:

This is incomplete project and some stuff was hurried up to be somewhat ready for deadline

Fix markdown in about

Making so user cant signup with same email on google and regular email/password signup

Making so that email user cant have same username as github or google users

When user or admin deletes comment or reply only text from comment/reply gets deleted not the whole comment

Adding ability to user to see his account with more details

Adding ability to admin to delete user accounts

Adding image ads to render between user images

Adding new signup possibilites(facebook, etc...)

Making server https

Adding redis in-memory data structure store

Use masonary to sort images based on height

Make it so website doesnt render all images at content rather on user scroll

Make website fully desktop and mobile responsive

Badly naming variables...

Finishing css....

And many more.....































