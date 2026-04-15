import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import pickle

# 1. Generate a small synthetic dataset
np.random.seed(42)
data_size = 50

donor_age = np.random.randint(18, 70, size=data_size)
recipient_age = np.random.randint(10, 80, size=data_size)
blood_match = np.random.randint(0, 2, size=data_size)
health_score = np.random.randint(1, 11, size=data_size)

# Logic for success: more likely if blood_match is 1 and health_score is high
# success = (blood_match * 0.6) + (health_score * 0.04) + random_noise
success_prob = (blood_match * 0.5) + (health_score * 0.05) - (np.abs(donor_age - recipient_age) * 0.001)
success = (success_prob + np.random.normal(0, 0.1, size=data_size) > 0.4).astype(int)

df = pd.DataFrame({
    'donor_age': donor_age,
    'recipient_age': recipient_age,
    'blood_match': blood_match,
    'health_score': health_score,
    'success': success
})

print("Sample Dataset:")
print(df.head())

# 2. Train the model
X = df[['donor_age', 'recipient_age', 'blood_match', 'health_score']]
y = df['success']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)

# 3. Save the model
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("\nModel trained and saved as model.pkl")
print(f"Model accuracy on test set: {model.score(X_test, y_test)*100:.2f}%")
