import jsonwebtoken from 'jsonwebtoken';


export const jwt = {
  sign(projectId: string) {
    return jsonwebtoken.sign({ projectId }, process.env.SECRET_KEY || '');
  },
  verify(secret: string) {
    return jsonwebtoken.verify(secret, process.env.SECRET_KEY || '') as { projectId: string; };
  },
};
