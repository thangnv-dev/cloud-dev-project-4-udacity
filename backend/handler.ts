'use strict'

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go serverless 3.0, Execution Successfully!',
        input: event
      },
      null,
      2
    )
  }
}
