import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    return x * (1 - x)

def softmax(x):
    exps = np.exp(x - np.max(x, axis=1, keepdims=True))  # for stability
    return exps / np.sum(exps, axis=1, keepdims=True)

#We want the canvas size to be the same (784)
#Canvas size is 64x64
input_size = 784
hidden_size = 64
output_size = 10

np.random.seed(42)
W1 = np.random.randn(input_size, hidden_size) * 0.01
#b1 = np.zeros((1, hidden_size))
W2 = np.random.randn(hidden_size, output_size) * 0.01
#b2 = np.zeros((1, output_size))

learning_rate = 0.1
epochs = 10
batch_size = 4

for epoch in range(epochs):
    for i in range(0, X_train.shape[0], batch_size):
        # Mini-batch
        X_batch = X_train[i:i+batch_size]
        y_batch = y_train[i:i+batch_size]

        # Forward pass
        z1 = np.dot(X_batch, W1)# + b1
        a1 = sigmoid(z1)
        z2 = np.dot(a1, W2)# + b2
        a2 = softmax(z2)

        # Compute loss (cross-entropy)
        loss = -np.mean(np.sum(y_batch * np.log(a2 + 1e-8), axis=1))

        # Backpropagation
        dz2 = a2 - y_batch
        dW2 = np.dot(a1.T, dz2)
        #db2 = np.sum(dz2, axis=0, keepdims=True)

        dz1 = np.dot(dz2, W2.T) * sigmoid_derivative(a1)
        dW1 = np.dot(X_batch.T, dz1)
        #db1 = np.sum(dz1, axis=0, keepdims=True)

        # Update weights
        W1 -= learning_rate * dW1 / batch_size
        #b1 -= learning_rate * db1 / batch_size
        W2 -= learning_rate * dW2 / batch_size
        #b2 -= learning_rate * db2 / batch_size

    print(f"Epoch {epoch+1}/{epochs}, Loss: {loss:.4f}")
