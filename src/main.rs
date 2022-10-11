use std::{process::Command, fs};

fn main() {
    let cmd = "python3";
    let script = "src/main.py";

    Command::new(cmd)
            .arg(script)
            .spawn()
            .expect("{cmd} command failed to start!");

    let raw_contents = fs::read_to_string("src/test.txt")
                        .expect("Could not open file!");

    println!("{raw_contents}");
}