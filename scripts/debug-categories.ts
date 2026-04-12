import { db } from '../lib/db';
import { ecosystemProjects } from '../lib/db/schema';

async function main() {
  try {
    const projects = await db.select({
      title: ecosystemProjects.title,
      categoryId: ecosystemProjects.categoryId
    }).from(ecosystemProjects);
    
    console.log('--- PROJECT CATEGORIES ---');
    projects.forEach(p => console.log(`${p.title}: ${p.categoryId}`));
    
    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
}

main();
