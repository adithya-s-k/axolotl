import { NextResponse } from "next/server"
import yaml from "js-yaml"

export const POST = async (req, res) => {
	const formData = await req.formData()
	const file = formData.get("file")

	if (!file) {
		return NextResponse.json({ error: "No files received." }, { status: 400 })
	}

	const buffer = Buffer.from(await file.arrayBuffer())

	const filename = file.name.replaceAll(" ", "_")

	try {
		// Convert YAML buffer to JSON
		const yamlContent = buffer.toString("utf8")
		const data = yaml.load(yamlContent)
		const jsonString = JSON.stringify(data, null, 2)

		return NextResponse.json({
			Message: "Success",
			status: 201,
			json: jsonString,
			yaml: yamlContent,
		})
	} catch (error) {
		console.log("Error occurred ", error)
		return NextResponse.json({ Message: error, status: 500 })
	}
}
