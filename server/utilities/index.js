export const Utility = {
  isTeacher: user => user?.role === 'teacher',
  isStudent: user => user?.role === 'student',
  isAdmin:   user => user?.role === 'admin',
};
