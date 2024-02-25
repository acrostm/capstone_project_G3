```mermaid
graph LR
    A[Frontend - Browser] -->|Register/Login| B[Backend - Server]
    B -->|Verify User| C{Database}
    A -->|Save JWT Token| A
    A -->|Send HTTP Request| B
    A -->|Capture Workout Gestures| D[Machine Learning Module]
    B -->|Receive Video Frames| D
    D -->|Process Video| D
    D -->|Send Processed Frames| A
    C -->|Store User Data| C
    C -.->|Login Credentials| B
    D -.->|Analyze Gestures| D
    D -.->|Grade Gestures| A

    classDef default fill:#f9f,stroke:#333,stroke-width:2px,color:black;
    classDef database fill:#bbf,stroke:#f66,stroke-width:2px,stroke-dasharray: 5, 5,color:black;
    classDef mlmodule fill:#dfb,stroke:#333,stroke-width:2px,color:black;
    class A,B,D default;
    class C database;
    class D mlmodule;
