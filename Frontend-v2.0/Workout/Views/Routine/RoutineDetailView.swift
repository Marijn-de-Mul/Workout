import SwiftUI

struct RoutineDetailView: View {
    var routine: Routine
    @State private var exercises: [Exercise] = []
    @State private var errorMessage: String?
    @State private var showSettings = false
    @State private var timer: Timer?

    var body: some View {
        VStack {
            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
            } else if exercises.isEmpty {
                VStack(spacing: 20) {
                    Text("No exercises available")
                        .font(.headline)
                    Text("You haven't added any exercises to this routine yet. Go to settings to add exercises.")
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
                        VStack(alignment: .leading) {
                            Text(exercise.name)
                                .font(.headline)
                            Text(exercise.description)
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                    }
                }
            }
        }
        .navigationBarItems(trailing: HStack {
            Button(action: {
                showSettings = true
            }) {
                Text("Edit")
            }
            ShareLink(item: URL(string: "https://pyworkout.marijndemul.nl/share/routine/\(routine.id)")!) {
                Image(systemName: "square.and.arrow.up")
            }
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
        .navigationTitle(routine.name)
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
            case .success(let allExercises):
                DispatchQueue.main.async {
                    self.exercises = allExercises.filter { $0.routineId == routine.id }
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
}
