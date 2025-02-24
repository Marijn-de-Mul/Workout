import SwiftUI

struct InfoView: View {
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 20) {
                Text("How Everything Works")
                    .font(.largeTitle)
                    .bold()

                Text("1. Add a routine category under Settings -> Routines -> Add Routine Category.")
                Text("2. Add a routine under Settings -> Routines -> Add Routine.")
                Text("3. Add an exercise category under Settings -> Exercises -> Add Exercise Category.")
                Text("4. Add an exercise under Settings -> Exercises -> Add Exercise.")

                Spacer()
            }
            .padding()
            .navigationBarTitle("Information", displayMode: .inline)
            .navigationBarItems(trailing: Button("Close") {
                presentationMode.wrappedValue.dismiss()
            })
        }
    }
}
