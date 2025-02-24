import SwiftUI

struct ExerciseView: View {
    @State private var exercises: [Exercise] = []
    @State private var errorMessage: String?
    @State private var showSettings = false
    @State private var timer: Timer?

    var body: some View {
        NavigationView {
            VStack {
                if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                } else if exercises.isEmpty {
                    VStack(spacing: 20) {
                        Text("No exercises available")
                            .font(.headline)
                        Text("You haven't created any exercises yet. Go to settings to create your first exercise.")
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                        Button(action: {
                            showSettings = true
                        }) {
                            Text("Go to Settings")
                                .font(.headline)
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.blue)
                                .cornerRadius(10)
                        }
                    }
                } else {
                    List(exercises) { exercise in
                        NavigationLink(destination: ExerciseDetailView(exercise: exercise)) {
                            Text(exercise.name)
                        }
                    }
                }
            }
            .navigationBarItems(trailing: Button(action: {
                showSettings = true
            }) {
                Text("Edit")
            })
            .sheet(isPresented: $showSettings) {
                SettingsView(isLoggedIn: .constant(true))
            }
            .onAppear {
                startTimer()
            }
            .onDisappear {
                stopTimer()
            }
            .padding()
            .navigationTitle("Exercises")
        }
    }

    private func startTimer() {
        getExercises()
        timer = Timer.scheduledTimer(withTimeInterval: 30.0, repeats: true) { _ in
            getExercises()
        }
    }

    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }

    private func getExercises() {
        NetworkManager.shared.getExercises { result in
            switch result {
            case .success(let exercises):
                DispatchQueue.main.async {
                    self.exercises = exercises
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
}
