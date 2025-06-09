Documenting the main issues that we currently have.

The expected result is that the user fills in username/password and clicks sign-in and it logs into the corporate account.
It has to prompt the user once for the mfa number passed to theire phone, but once they do that it continues on the process and logs in and downloads the users 3 week schedules without further interation.

The main breaking points we have are.
The 2nd password prompt referred to as "Login Form 2" rejects validation when you input username/password, and we have struggled to determine exactly why it is failing.
If the user is accessing via chrome on the desktop and that username/password field is filled in by chrome password manager it accepts the username password. If we have automation in webview and populate it, it does not work unless we manually delete and add the last character in the user and password field.  Trying autoamtion that does this exact step that is deleting and adding the last character in the field programmatically will fail validation.
That is the 1st main issue we are encountering.

The 2nd main issue is consistently importing all 3 schedules, we sometimes import 2 schedules and sometimes import 3 schedules.
It is somewhat random, as most of the time it gets 3 schedules but sometimes only imports 2 schedules.


