import { db } from '../lib/db';
import { ecosystemProjects, submissions } from '../lib/db/schema';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const projectsCount = await db.select({ count: sql<number>`count(*)` }).from(ecosystemProjects);
    const submissionsCount = await db.select({ count: sql<number>`count(*)` }).from(submissions);
    
    console.log('--- DATABASE STATUS ---');
    console.log('Ecosystem Projects Count:', projectsCount[0].count);
    console.log('Submissions Count:', submissionsCount[0].count);
    
    const sample = await db.select().from(ecosystemProjects).limit(1);
    console.log('Sample Project:', sample[0]?.title || 'NONE');
    
    process.exit(0);
  } catch (err) {
    console.error('DB Check Failed:', err);
    process.exit(1);
  }
}

main();
