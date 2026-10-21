#!/bin/bash
# Script to setup an AWS Billing Alarm using AWS CLI

EMAIL_ADDRESS=$1
ALERT_THRESHOLD=${2:-5.0} # Default $5 alert

if [ -z "$EMAIL_ADDRESS" ]; then
    echo "Usage: ./setup_cost_alert.sh <your-email@example.com> [threshold-in-usd]"
    exit 1
fi

echo "Setting up AWS Billing Alarm for ${ALERT_THRESHOLD} USD to ${EMAIL_ADDRESS}..."

# 1. Create SNS Topic
TOPIC_ARN=$(aws sns create-topic --name VolleyStackBillingAlerts --region us-east-1 --output text --query 'TopicArn')

echo "SNS Topic Created: $TOPIC_ARN"

# 2. Subscribe Email to Topic
aws sns subscribe \
    --topic-arn "$TOPIC_ARN" \
    --protocol email \
    --notification-endpoint "$EMAIL_ADDRESS" \
    --region us-east-1

echo "Subscription sent. Please check your email to confirm the subscription."

# 3. Create CloudWatch Alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "VolleyStack-Cost-Alert-$ALERT_THRESHOLD" \
    --alarm-description "Alarm when AWS spending exceeds $ALERT_THRESHOLD USD" \
    --metric-name EstimatedCharges \
    --namespace AWS/Billing \
    --statistic Maximum \
    --period 21600 \
    --threshold "$ALERT_THRESHOLD" \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name=Currency,Value=USD \
    --evaluation-periods 1 \
    --alarm-actions "$TOPIC_ARN" \
    --region us-east-1

echo "Billing Alarm created successfully."
