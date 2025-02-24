import SwiftUI
import AVKit

struct ExerciseDetailView: View {
    var exercise: Exercise

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text(exercise.name)
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding(.top)
                .padding(.horizontal)
                .multilineTextAlignment(.center)

            Text(exercise.description)
                .font(.body)
                .foregroundColor(.secondary)
                .padding(.horizontal)

            VideoPlayer(player: AVPlayer(url: URL(string: "https://www.example.com/placeholder.mp4")!))
                .frame(height: 200)
                .cornerRadius(10)
                .padding(.horizontal)

            Group {
                Text("Extra Information")
                    .font(.headline)
                    .padding(.horizontal)

                Text("This section contains additional details about the exercise. This will become availlable in a later update.")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .padding(.horizontal)
            }
            .disabled(true)
            .opacity(0.5)

            Spacer()
        }
        .padding()
        .background(Color(.systemGroupedBackground))
        .navigationTitle("Exercise Details")
    }
}
