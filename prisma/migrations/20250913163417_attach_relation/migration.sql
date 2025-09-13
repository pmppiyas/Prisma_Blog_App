-- AddForeignKey
ALTER TABLE "public"."Posts" ADD CONSTRAINT "Posts_authoreId_fkey" FOREIGN KEY ("authoreId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
