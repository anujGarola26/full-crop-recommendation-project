# train_model.py - Crop Recommendation ML Model Training

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

print("=" * 50)
print("🌾 CROP RECOMMENDATION MODEL TRAINING")
print("=" * 50)

# Step 1: Load Data
print("\n📂 Loading dataset...")
try:
    df = pd.read_csv('crop_data.csv')
    print(f"✅ Dataset loaded successfully!")
    print(f"   Rows: {len(df)}, Columns: {len(df.columns)}")
except FileNotFoundError:
    print("❌ Error: crop_data.csv not found!")
    print("   Please download dataset and place in ml-model folder")
    exit()

# Step 2: Check Data
print("\n📊 Dataset Preview:")
print(df.head())
print(f"\n🌾 Unique Crops: {df['label'].nunique()}")
print(f"   Crops: {', '.join(df['label'].unique()[:10])}")

# Step 3: Prepare Data
print("\n🔧 Preparing data for training...")
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

print(f"   Features (X): {X.shape}")
print(f"   Labels (y): {y.shape}")

# Step 4: Split Data (80% train, 20% test)
print("\n✂️ Splitting data (80% train, 20% test)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"   Training samples: {len(X_train)}")
print(f"   Testing samples: {len(X_test)}")

# Step 5: Train Model
print("\n🤖 Training Random Forest Model...")
print("   This may take 10-30 seconds...")

model = RandomForestClassifier(
    n_estimators=100,  # 100 decision trees
    random_state=42,
    max_depth=10,
    n_jobs=-1  # Use all CPU cores
)

model.fit(X_train, y_train)
print("   ✅ Model training complete!")

# Step 6: Test Model
print("\n🧪 Testing model accuracy...")
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"   🎯 Accuracy: {accuracy * 100:.2f}%")

# Show detailed report (first 10 crops)
print("\n📈 Classification Report (preview):")
report = classification_report(y_test, y_pred, output_dict=True)
for crop, metrics in list(report.items())[:10]:
    if crop not in ['accuracy', 'macro avg', 'weighted avg']:
        print(f"   {crop}: Precision={metrics['precision']:.2f}, Recall={metrics['recall']:.2f}")

# Step 7: Save Model
print("\n💾 Saving trained model...")
model_filename = 'crop_model.pkl'
with open(model_filename, 'wb') as f:
    pickle.dump(model, f)

print(f"   ✅ Model saved as: {model_filename}")
print(f"   📦 File size: {os.path.getsize(model_filename) / 1024:.2f} KB")

# Step 8: Test Prediction (Sample)
print("\n🧪 Testing sample prediction...")
sample = [[90, 42, 43, 25.5, 80, 6.5, 202.5]]  # Sample NPK values
prediction = model.predict(sample)
print(f"   Input: N=90, P=42, K=43, Temp=25.5°C, Humidity=80%, pH=6.5, Rainfall=202.5mm")
print(f"   🌾 Predicted Crop: {prediction[0]}")

print("\n" + "=" * 50)
print("✅ MODEL TRAINING COMPLETE!")
print("=" * 50)
print("\n📝 Next Steps:")
print("   1. Model saved as 'crop_model.pkl'")
print("   2. Run Flask API: python app.py")
print("   3. Test predictions via API")
