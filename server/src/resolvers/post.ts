import {
  Resolver,
  Query,
  Arg,
  Mutation,
  UseMiddleware,
  Ctx,
  Int,
  FieldResolver,
  Root,
} from "type-graphql";
import { DeleteResult, getConnection } from "typeorm";
import { isAuth } from "../entity/middleware/isAuth";
import { Post } from "../entity/Post";
import { MyContext } from "../types";
@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textShortened(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Query(() => [Post]) //return array of posts.
  async posts(
    // pagination, orderded by new.
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    const realLimit = Math.min(50, limit);
    const queryBuilder = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy("created_at", "DESC")
      .take(realLimit);

    if (cursor) {
      queryBuilder.where("created_at < :cursor", {
        cursor: new Date(parseInt(cursor)),
      });
    }
    return queryBuilder.getMany();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id") id: number): Promise<Post | undefined> {
    return await Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      title,
      text,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    post.title = title;
    return await Post.save(post);
  }

  @Mutation(() => Post, { nullable: true })
  async deletePost(@Arg("id") id: number): Promise<DeleteResult> {
    return await Post.delete(id);
  }
}
