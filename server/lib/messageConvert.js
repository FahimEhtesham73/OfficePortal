module.exports.firstMailMessage = (userName, monthName) => {
    return `
Dear ${userName},

I hope this email finds you well. I wanted to bring to your attention that you were marked as 1 day late for work month ${monthName}. I understand that sometimes unexpected situations can arise, but it is important to ensure punctuality to maintain the smooth functioning of our team and operations.

Please make sure to manage your time effectively and arrive at the office on time moving forward. Consistent punctuality is crucial, and we appreciate your attention to this matter.
Thank you for your cooperation.

Best regards,
NSL HR `
}

module.exports.secondMailMessage = (userName, monthName) => {
    return `
Dear ${userName},

I hope you are doing well. I noticed that you were late to work for the 2nd time in ${monthName}. As punctuality is critical for our team's productivity and overall work environment, this is a matter of concern.

Please take a moment to discuss this with your team lead, to explain any circumstances that may have led to your late arrival. Alternatively, you may speak directly with HR if there are any underlying issues you would like to discuss in confidence.

We value your contributions to the team and trust that you will take the necessary steps to ensure timely arrival in the future.

Thank you for your attention to this matter.

Best regards,
NSL HR
                    `
}

module.exports.thirdMailMessage = (userName, monthName, count) => {
    return `
Dear ${userName},

I hope you are well. I regret to inform you that this is the third or more (${count}) instance of lateness within ${monthName}. As previously communicated, punctuality is crucial for our team's efficiency and effectiveness. Repeated tardiness disrupts our workflow and sets a concerning precedent.

Due to the recurrence of this issue, you are now subject to disciplinary guidelines as per our company policy. We kindly request that you schedule a meeting with your team lead, or with HR to discuss this matter further and to understand the potential consequences if this pattern continues.

Thank you for addressing this matter promptly.

Best Regards,
NSL HR
                    `
}