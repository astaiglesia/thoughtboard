/** verifyAuthProcess()
 *
 *  PassportJS suth strategies require a `verification` function, which accepts
 *  credentials (in this case, an accessToken, refreshToken, and GitHub
 *  profile), and invokes a callback with a user object.
 *
 * @param accessToken
 * @param refreshToken
 * @param profile
 * @param done
 */

export default async function verifyAuthProcess(
  accessToken: any,
  refreshToken: any,
  profile: any,
  done: (arg0: null, arg: any) => void
): Promise<void> {
  console.log('Verification of access token from auth server: ', accessToken);
  console.log('----- associated with the returned profile: ', profile);
  process.nextTick(() => done(null, profile));
  /** [] implement db logic to search for and create new users with the returned data
   *
   * To keep the example simple, the user's GitHub profile is returned to
   * represent the logged-in user.
   * we will associate the GitHub account with a user record in your database,
   * and return that user instead.
   *
   * we can also implement other checks/ middleware/ business logic with the returned profile here
   * */

  // nextTick simulates awaiting an async db verification process
  // [] unwrap nextTick() when db logic is implemented
}
