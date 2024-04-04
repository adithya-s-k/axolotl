import { Readable } from "stream"
import { NextResponse } from "next/server"
import yaml from "js-yaml"

export const POST = async (req, res) => {
	try {
		const { json, file_name } = await req.json()
		const filename = "new_" + file_name.replaceAll(" ", "_")
		const yamlContent = yaml.dump(json)
		const yamlStream = Readable.from([yamlContent])

		const response = new NextResponse(yamlStream, {
			status: 200,
			headers: new Headers({
				"content-disposition": `attachment; filename=${filename}`,
				"content-type": "application/x-yaml",
				"content-length": Buffer.byteLength(yamlContent),
			}),
		})
		return response
	} catch (error) {
		console.error("Error occurred:", error)
		// Return error response
		return NextResponse.json({ Message: "Failed", status: 500 })
	}
}
