export default 
{
	"projectName": "Sample Project",
	"apiVersion": "1.1",
	"nodes": [
		{
			"name": "root",
			"type": "Folder",
			"id": 20,
			"attributes": {},
			"children": [
				{
					"name": "bigLeaf.ts",
					"type": "File",
					"id": 0,
					"attributes": { "rloc": 120, "functions": 10, "mcc": 1 },
					"link": "http://www.google.de"
				},
				{
					"name": "ParentLeaf",
					"type": "Folder",
					"id": 1,
					"attributes": {},
					"children": [
						{
							"name": "smallLeaf.html",
							"type": "File",
							"id": 2,
							"attributes": { "rloc": 30, "functions": 101, "mcc": 80 }
						},
						{
							"name": "otherSmallLeaf.ts",
							"type": "File",
							"id": 3,
							"attributes": { "rloc": 70, "functions": 10, "mcc": 100 }
						},
						{
							"name": "sample2LeafMergedIn.kt",
							"type": "File",
							"attributes": { "rloc": 600, "functions": 10, "mcc": 1 },
							"link": "http://www.google.de"
						}
					]
				}
			]
		}
	],
	"attributeTypes": {
		"nodes": [{ "rloc": "absolute" }, { "functions": "absolute" }, { "mcc": "absolute" }]
	}
}