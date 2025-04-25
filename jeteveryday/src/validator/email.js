let SibApiV3Sdk = require('sib-api-v3-sdk')

let sendinblueApiKey = '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'
let defaultClient = SibApiV3Sdk.ApiClient.instance

let apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = sendinblueApiKey

let sendEmail = async function (clientName, clientEmail, clientPhoneNumber, flightDetails, serviceProviderDetails) {
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
    sendSmtpEmail.to = [{ email: 'manish@jeteveryday.com' }]
    sendSmtpEmail.sender = { email: 'manthantanwar1@gmail.com' }
    sendSmtpEmail.subject = 'Flight Booking Request'
    sendSmtpEmail.textContent = `A flight booking request has been made by a user: 
    
    **Client Details:**
    - Name - ${clientName}
    - Phone Number - ${clientPhoneNumber}
    - Email - ${clientEmail}
    
    **Flight Details:**
    - Flight: ${flightDetails.flight}
    - Date: ${flightDetails.date}
    - Departure Location: ${flightDetails.departureLocation}
    - Departure Time: ${flightDetails.departureTime}
    - Arrival Location: ${flightDetails.arrivalLocation}
    - Arrival Time: ${flightDetails.arrivalTime}
    - Price Per Seat: ${flightDetails.pricePerSeat}
    - Chartered Price: ${flightDetails.charteredPrice}
    - Number Of Seat: ${flightDetails.numberOfSeat}
    - Number Of Passengers: ${flightDetails.numberOfPassengers}

    **Service Provider Details:**
    - Provider Name: ${serviceProviderDetails.name}
    - Provider Contact: ${serviceProviderDetails.contact}
    
    Please review the request.`
    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail)
        console.log('Mail sent successfully')
    } catch (error) {
        console.error('Error sending email:', error.message)
    }
}

module.exports = { sendEmail }