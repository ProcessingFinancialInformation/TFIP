open System
open System.IO

let root = @"TFIP.Web.UI\Scripts\"

let asReference file = sprintf "/// <reference path=\"%s\"/>" file
let outputFile = "_references.ts"

let tsFiles = Directory.GetFiles(root, "*.ts", SearchOption.AllDirectories)
              |> Array.map(fun file -> file.Replace(root, String.Empty))
              |> Array.filter ((<>) outputFile)

let references = tsFiles |> Array.map asReference

File.WriteAllLines(Path.Combine(root, outputFile), references)