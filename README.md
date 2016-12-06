UBeyond-Website
---------------------
   
#Release Notes

##New software features
###Version 1.0
- Able to create Mentor's and Mentee Account's.
- Admin Accounts are created through the Firebase Dash, then added to the Firebase Database.
- Algorithm uses heuristic checking three fields (Field Preference, Gender, Langauge) in that order of imporatnce, to match Mentor/Mentee.
- Admin is able to approve a match. 
- Mentee/Mentor have a "blacklist" so they aren't matched twice if Admin rejects the match.

##Bugs and defects
- No current way for Mentor/Mentee to modify their orginal input data. 

#Install Guide

##Pre-requisites
- A web server that can support ASP.NET web applications

##Dependent Libraries that must be installed:
- FireSharp
- Bootstrap

##Download instructions
- All files necessary to run the application are available through this repository.

##Installation of actual application
1. Copy frontend libraries to root folder of the Web Server through FTP
2. publish the endpoints from visual studios
  1. Open U-Beyond Website.sln in Visual Studio 2015
  2. Under the "build" menu, click publish
  3. click "next" and then "finish" when promted by VS

##Run instructions
- Access this web server through any web browser

##Troubleshooting
- Make sure that the correct Web.config file is located on the web server
