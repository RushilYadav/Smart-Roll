import bcrypt from 'bcrypt';

const passwords = ['admin123', 'teacher123', 'student123'];

const hashPasswords = async () => {
  for (const pw of passwords) {
    const hash = await bcrypt.hash(pw, 10);
    console.log(`${pw} -> ${hash}`);
  }
};

hashPasswords();
