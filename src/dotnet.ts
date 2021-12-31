import { filepaths } from "@fig/autocomplete-generators";

const DOTNET_ICON =
  "https://upload.wikimedia.org/wikipedia/commons/a/a3/.NET_Logo.svg";

const commands: Fig.Subcommand[] = [
  {
    name: "new",
    loadSpec: "dotnet/dotnet-new",
    icon: DOTNET_ICON,
  },
  {
    name: "add",
    loadSpec: "dotnet/dotnet-add",
    icon: DOTNET_ICON,
  },
  {
    name: "list",
    loadSpec: "dotnet/dotnet-list",
    icon: DOTNET_ICON,
  },
  {
    name: "remove",
    loadSpec: "dotnet/dotnet-remove",
    icon: DOTNET_ICON,
  },
  {
    name: "build",
    loadSpec: "dotnet/dotnet-build",
    icon: DOTNET_ICON,
  },
  {
    name: "build-server",
    loadSpec: "dotnet/dotnet-build-server",
    icon: DOTNET_ICON,
  },
  {
    name: "clean",
    loadSpec: "dotnet/dotnet-clean",
    icon: DOTNET_ICON,
  },
  {
    name: "format",
    loadSpec: "dotnet/dotnet-format",
    icon: DOTNET_ICON,
  },
  {
    name: "migrate",
    loadSpec: "dotnet/dotnet-migrate",
    icon: DOTNET_ICON,
  },
  {
    name: "msbuild",
    loadSpec: "dotnet/dotnet-msbuild",
    icon: DOTNET_ICON,
  },
  {
    name: "nuget",
    loadSpec: "dotnet/dotnet-nuget",
    icon: DOTNET_ICON,
  },
  {
    name: "pack",
    loadSpec: "dotnet/dotnet-pack",
    icon: DOTNET_ICON,
  },
  {
    name: "publish",
    loadSpec: "dotnet/dotnet-publish",
    icon: DOTNET_ICON,
  },
  {
    name: "restore",
    loadSpec: "dotnet/dotnet-restore",
    icon: DOTNET_ICON,
  },
  {
    name: "run",
    loadSpec: "dotnet/dotnet-run",
    icon: DOTNET_ICON,
  },
  {
    name: "sln",
    loadSpec: "dotnet/dotnet-sln",
    icon: DOTNET_ICON,
  },
  {
    name: "store",
    loadSpec: "dotnet/dotnet-store",
    icon: DOTNET_ICON,
  },
  {
    name: "test",
    loadSpec: "dotnet/dotnet-test",
    icon: DOTNET_ICON,
  },
  {
    name: "tool",
    loadSpec: "dotnet/dotnet-tool",
    icon: DOTNET_ICON,
  },
];

const completionSpec: Fig.Spec = {
  name: "dotnet",
  description: "The dotnet cli",
  icon: DOTNET_ICON,
  args: {
    name: "command",
    isOptional: true,
    generators: filepaths({ extensions: ["dll"] }),
  },
  options: [
    {
      name: "--version",
      description:
        "Prints out the version of the .NET SDK used by dotnet commands. Includes the effects of any global.json",
    },
    {
      name: "--info",
      description:
        "Prints out detailed information about a .NET installation and the machine environment, such as the current operating system, and commit SHA of the .NET version",
    },
    {
      name: "--list-runtimes",
      description:
        "Prints out a list of the installed .NET runtimes. An x86 version of the SDK lists only x86 runtimes, and an x64 version of the SDK lists only x64 runtimes",
    },
    {
      name: "--list-sdks",
      description: "Prints out a list of the installed .NET SDKs",
    },
    {
      name: ["-?", "-h", "--help"],
      description: "Prints out a list of available commands",
    },
    {
      name: ["-d", "--diagnostics"],
      description: "Enables diagnostic output",
    },
    {
      name: ["-v", "--verbosity"],
      description:
        "Sets the verbosity level of the command. Allowed values are q[uiet], m[inimal], n[ormal], d[etailed], and diag[nostic]. Not supported in every command. See specific command page to determine if this option is available",
      args: {
        name: "verbosity",
        suggestions: ["quiet", "minimal", "normal", "detailed", "diagnostic"],
      },
    },
    {
      name: "--additionalprobingpath",
      description: "Path containing probing policy and assemblies to probe",
      args: {
        name: "path",
        template: "folders",
      },
    },
    {
      name: "--additional-deps",
      description:
        "Path to an additional .deps.json file. A deps.json file contains a list of dependencies, compilation dependencies, and version information used to address assembly conflicts. For more information, see Runtime Configuration Files on GitHub",
      args: {
        name: "deps",
        template: "filepaths",
      },
    },
    {
      name: "-depsfile",
      description:
        "Path to the deps.json file. A deps.json file is a configuration file that contains information about dependencies necessary to run the application. This file is generated by the .NET SDK",
      args: {
        name: "deps",
        template: "filepaths",
      },
    },
    {
      name: "--runtimeconfig",
      description:
        "Path to a runtimeconfig.json file. A runtimeconfig.json file is a configuration file that contains run-time settings",
      args: {
        name: "path",
        template: "filepaths",
      },
    },
    {
      name: "--roll-forward",
      description:
        "Controls how roll forward is applied to the app. The SETTING can be one of the following values. If not specified, Minor is the default",
      args: {
        name: "setting",
        suggestions: [
          "LatestPatch",
          "Minor",
          "Major",
          "LatestMinor",
          "LatestMajor",
          "Disable",
        ],
      },
    },
    {
      name: "--fx-version",
      description: "Version of the .NET runtime to use to run the application",
      args: {
        name: "version",
      },
    },
  ],
  subcommands: commands,
  async generateSpec(_, executeShellCommand) {
    const argRegex = /(([a-zA-Z \.\[\]#,/][^ ]{1,})+)/g;

    const subcommands: Fig.Subcommand[] = [];
    const toolList = await executeShellCommand("dotnet tool list --global");

    const lines = toolList.split("\n").slice(2);

    for (const line of lines) {
      const [_, __, command] = line
        .match(argRegex)
        .map((match) => match.trim());

      const commands = command.split(",").map<Fig.Subcommand>((cmd) => {
        const value = cmd.replace("dotnet-", "");

        return {
          name: value,
          description: cmd,
          args: {
            name: "args",
            isOptional: true,
          },
        };
      });

      subcommands.push(...commands);
    }

    return {
      name: "dotnet",
      subcommands,
    };
  },
};

export default completionSpec;
