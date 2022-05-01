import { GrepArchivesUC } from "../usecases/grepArchive.ts";

export const putGreps = (grepArchives: GrepArchivesUC) =>
  async (req: Request) => {
    const formData = await req.formData();

    const grepPatterns = formData.getAll("pattern").map((formValue) =>
      formValue.toString()
    );
    const paths = formData.getAll("path").map((formValue) =>
      formValue.toString()
    );

    const { hits } = await grepArchives({ paths, grepPatterns });
    const body = JSON.stringify({ hits });

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  };
