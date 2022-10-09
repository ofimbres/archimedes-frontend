export const awsExports = {
                    aws_cognito_region: 'us-west-2', // (required) - Region where Amazon Cognito project was created
                    aws_user_pools_id: 'us-west-2_1DuoJgSqN', // (optional) -  Amazon Cognito User Pool ID
                    
                    aws_user_pools_web_client_id: '2ba4j54rtfsvpgtq7rfr2a3a0m', // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)

                    aws_mandatory_sign_in: 'enable' // (optional) - Users are not allowed to get the aws credentials unless they are signed in
};