export const awsExports = {
  aws_cognito_region: 'us-west-2', // (required) - Region where Amazon Cognito project was created
  aws_user_pools_id: 'us-west-2_6Zc7iHqlB', // (optional) -  Amazon Cognito User Pool ID

  aws_user_pools_web_client_id: '5ift4omv8015t3i78jpni065sv', // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)

  aws_mandatory_sign_in: 'enable', // (optional) - Users are not allowed to get the aws credentials unless they are signed in
};