export const awsExports = {
                    aws_cognito_region: 'us-west-2', // (required) - Region where Amazon Cognito project was created
                    aws_user_pools_id: 'us-west-2_L1d4rVi4m', // (optional) -  Amazon Cognito User Pool ID
                    aws_user_pools_web_client_id: '3n6mitm1fj8q4kjco00fnp45kf', // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
                    aws_cognito_identity_pool_id:
                      'us-west-2:6ea2fd73-52f5-4f9f-b872-590f885a6a31', // (optional) - Amazon Cognito Identity Pool ID
                    aws_mandatory_sign_in: 'enable' // (optional) - Users are not allowed to get the aws credentials unless they are signed in
};