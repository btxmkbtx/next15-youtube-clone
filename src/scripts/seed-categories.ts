// 这个脚本是用来帮助我向db的【categories】表作成初始数据的
// 执行：bun src\scripts\seed-categories.ts
// 再打开db的categories查看就能看到所以的数据了。
// 这就是bun的强大之处，因为node是无法解析运行import关键字的
import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and animation",
  "How-to and style",
  "Music",
  "News and politics",
  "People and blogs",
  "Pets and animals",
  "Science and technology",
  "Sports",
  "Travel and events",
];

async function main() {
  console.log("Seeding categories...");

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Videos related to ${name.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);
    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories: ", error);
    process.exit(1);
  }
}

main();
