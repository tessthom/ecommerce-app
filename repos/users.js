import fs from 'fs';

/**
 * UsersRepo
 * Methods:
 * getAll() return [user] list of all users
 * getOne(id) return user with spec'd ID
 * getOneBy(filters) return user with spec'd filters
 * create(attributes) create a user with spec'd attributes
 * update(id, attributes) update ID-spec'd user with spec'd attributes
 * delete(id) delete user with spec'd ID
 * randomId() returns random user ID
 * writeAll() writes all users to users.json
 */
class UsersRepo {
  constructor(filename) {
    if (!filename) {
      throw new Error('Must enter filename to create a repository.');
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename); // Synchronous version of `fs.access` used because this project will only be used by me with a single Users repo, so it's no problem to run x1/app lifecycle and avoids file check logic needing to be written in a separate method and called separately from class init.
    } catch (err) {
      // if file doesn't exist yet, create it (synchronously for same reasons as `accessSync`)...
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll() {
    // read the file, return its parsed contents
    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: 'utf8' })
    );
  }

  async create(attrs) { // attrs => { email: 'boop@bloop.com', password: 'shmoop' }
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
  }

  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2)); // writeFile replaces file if already exists, so no need to clear it before writing updated data. 
  }
}

const test = async () => {  // async wrapper fn to avoid top-level await
  const repo = new UsersRepo('users.json'); // get access to new repo

  await repo.create({ email: 'test@test.com', password: 'password' }); // write new record to repo

  const users = await repo.getAll(); // get all saved records

  console.log(users); // log records
}

test();