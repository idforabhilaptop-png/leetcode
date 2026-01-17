import mongoose from "mongoose"

async function main() {

    await mongoose.connect(process.env.MONGO_URI);


}
export default main