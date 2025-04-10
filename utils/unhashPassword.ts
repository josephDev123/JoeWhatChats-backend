// import * as bcrypt from "bcrypt";
import bcrypt from "bcryptjs";

export function unhashPassword(
  myPlaintextPassword: string,
  hash: string | undefined
) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(
      myPlaintextPassword,
      hash as string,
      function (err: any, result: boolean | undefined) {
        if (err) {
          reject(err.message);
        } else {
          resolve(result === true);
        }
      }
    );
  });
}
