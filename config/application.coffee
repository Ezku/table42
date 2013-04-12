# -- Required settings --

steroids.config.name = "New Application"

# -- Location --
# Defines starting location for applications without a tab bar.
# Tabs will override this value.
# Can be one of these:
#   - file URL (relative to www, f.e. index.html)
#   - http://localhost/ (serves files locally from www, f.e. http://localhost/index.html would serve index.html)
#   - http://www.google.com (directly from internet)

steroids.config.location = "http://localhost/index.html"

# -- Remote hosts --
# Defines the hostnames that the application will capture and serve application files from.
# F.e. adding mobileapp.example.com to the list, http://mobileapp.example.com/index.html will be served locally just like http://localhost/index.html
# Default: []
#
# steroids.config.hosts = ["mobileapp.example.com", "m.example.net"]

# -- Tabs --
#
# A boolean to enable tab bar (on bottom)
# This will override steroids.config.location (that is for single webview apps, like in PhoneGap)
# Default: false
#
# steroids.config.tabBar.enabled = true
#
# Array with objects to specify which tabs are created on app startup
#
# Tab object properties are:
# - title: text to show in tab title
# - icon: path to icon file (f.e. images/icon@2x.png)
# - location: like steroids.config.location, can be one of these:
#   - file URL (relative to www, f.e. index.html)
#   - http://localhost/index.html (serves files locally from www, f.e. http://localhost/index.html would serve www/index.html)
#   - http://www.google.com (directly from internet)
#
# steroids.config.tabBar.tabs = [
#   {
#     title: "Index"
#     icon: "icons/shoebox@2x.png"
#     location: "http://localhost/index.html"
#   },
#   {
#     title: "Internet"
#     icon: "icons/telescope@2x.png"
#     location: "http://www.google.com"
#   }
# ]

# -- Status bar --
# Sets status bar visible (carrier, clock, battery status)
# Default: false

steroids.config.statusBar.enabled = true

# -- Colors --
# Color values can be set in hex codes, eg. #ffbb20
# Setting these values override values set by the application theme in steroids.config.theme
# Default for all attributes: ""

steroids.config.navigationBar.tintColor = "#00aeef"
steroids.config.navigationBar.titleColor = "#ffffff"
steroids.config.navigationBar.titleShadowColor = "#000000"

steroids.config.navigationBar.buttonTintColor = "#363636"
steroids.config.navigationBar.buttonTitleColor = "#ffffff"
steroids.config.navigationBar.buttonShadowColor = "#000000"

# steroids.config.tabBar.tintColor = ""
# steroids.config.tabBar.tabTitleColor = ""
# steroids.config.tabBar.tabTitleShadowColor = ""
# steroids.config.tabBar.selectedTabTintColor = ""
#
# Can be used to set an indicator image for the selected tab (can be bigger than the tab)
# Default: ""
# steroids.config.tabBar.selectedTabBackgroundImage = ""
#
# Built-in iOS theme, values: black and default
# Default: "default"
#
# steroids.config.theme = "default"
