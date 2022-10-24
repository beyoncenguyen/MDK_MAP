{
	"_Name": "MDK_Map",
	"Version": "/MDK_Map/Globals/AppDefinition_Version.global",
	"MainPage": "/MDK_Map/Pages/Main.page",
	"OnLaunch": [
		"/MDK_Map/Actions/Service/InitializeOnline.action"
	],
	"OnWillUpdate": "/MDK_Map/Rules/OnWillUpdate.js",
	"OnDidUpdate": "/MDK_Map/Actions/Service/InitializeOnline.action",
	"Styles": "/MDK_Map/Styles/Styles.less",
	"Localization": "/MDK_Map/i18n/i18n.properties",
	"_SchemaVersion": "6.3"
}