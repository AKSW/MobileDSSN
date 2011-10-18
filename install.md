# Tools
* Android SDK 2.2+
* Eclipse

## How to build
1. Set up Eclipse with Android SDK - [detailed instructions](http://developer.android.com/sdk/installing.html)
2. Clone MobileDSSN repository into local folder
3. Change branch to android (git checkout android)
4. Create new Android project in Eclipse, select "Create from existing source" and point to MobileDSSN folder
5. Open project properties -> Java Build Path and add Phonegap-x.x.x.jar file from libs/ folder
6. Run the app