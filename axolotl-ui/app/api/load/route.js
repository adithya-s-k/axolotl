import { NextResponse } from "next/server"
import yaml from "js-yaml"
import path from 'path'
import fs from 'fs'

export const POST = async (req, res) => {

     try {
				const { file_url } = await req.json()
				console.log(file_url)

                const file_path = path.join(process.cwd(), 'public', 'examples', `${file_url}.yml`);

				// Read the file content synchronously
				const yamlContent = fs.readFileSync(file_path, "utf8")

				// Convert YAML content to JSON
				const data = yaml.load(yamlContent)
				const jsonString = JSON.stringify(data, null, 2)

				// Return JSON response
				return NextResponse.json({
					Message: "Success",
					status: 201,
					json: jsonString,
					yaml: yamlContent,
				})
			} catch (error) {
				console.log("Error occurred ", error)
				return NextResponse.json({ Message: "Failed", status: 500 })
			}

		
	
}
