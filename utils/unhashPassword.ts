import * as bcrypt from "bcrypt";

export function unhashPassword(
  myPlaintextPassword: string,
  hash: string | undefined
) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(
      myPlaintextPassword,
      hash as string,
      function (err: any, result: boolean) {
        if (err) reject(err.message);
        resolve(result);
      }
    );
  });
}
