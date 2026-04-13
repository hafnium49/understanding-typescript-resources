// LESSON 184 — Second file extracted from app.ts.
// Same namespace name "App" so that the enum and class are available
// in other files that also use namespace App.
namespace App {
  export enum ProjectStatus {
    Active,
    Finished
  }

  export class Project {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public people: number,
      public status: ProjectStatus
    ) {}
  }
}
